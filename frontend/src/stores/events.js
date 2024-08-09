import { defineStore } from 'pinia'
import axios from 'axios'

export const useEventStore = defineStore('events', {
  state: () => ({
    familyMembers: [],
    events: [],
    selectedMember: null,
    selectedDate: new Date(),
    searchQuery: '',
    pendingEvents: new Set(), // 用于跟踪正在添加的事件
  }),

  getters: {
    filteredEvents: (state) => {
      return state.events.filter(event => {
        const eventStartDate = new Date(event.startDate);
        const matchesDate = 
          eventStartDate.getFullYear() === state.selectedDate.getFullYear() &&
          eventStartDate.getMonth() === state.selectedDate.getMonth() &&
          eventStartDate.getDate() === state.selectedDate.getDate();
        const matchesSearch = !state.searchQuery || event.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesMember = !state.selectedMember || 
                              state.selectedMember === '全家' || 
                              event.role === state.selectedMember;
        
        return matchesDate && matchesSearch && matchesMember;
      });
    }
  },

  actions: {
    async fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        this.events = response.data;
        console.log('Fetched events:', this.events);
      } catch (error) {
        console.error('获取事件失败:', error);
      }
    },

    setSelectedMember(memberName) {
      console.log('Setting selected member:', memberName);
      this.selectedMember = memberName;
    },
    
    resetSelectedMember() {
      console.log('Resetting selected member');
      this.selectedMember = null;
    },
    
    async fetchFamilyMembers() {
      try {
        const response = await axios.get('/api/roles');
        this.familyMembers = response.data.map(role => ({
          id: role._id,
          name: role.name,
          weeklyStars: 0,
          isDefault: role.isDefault,
          color: role.color || this.getDefaultColor(role.name),
          borderColor: role.borderColor || this.getDefaultBorderColor(role.name)
        }));
      } catch (error) {
        console.error('获取家庭成员失败:', error);
      }
    },

    getDefaultColor(roleName) {
      const colors = {
        '全家': '#e0e0e0',
        '爸爸': '#bbdefb',
        '妈妈': '#f8bbd0',
        '弟弟': '#c8e6c9',
        '姐姐': '#ffecb3',
        '阿姨': '#d7ccc8'
      };
      return colors[roleName] || '#e0e0e0';
    },

    getDefaultBorderColor(roleName) {
      const borderColors = {
        '全家': '#9e9e9e',
        '爸爸': '#1976d2',
        '妈妈': '#e91e63',
        '弟弟': '#4caf50',
        '姐姐': '#ffa000',
        '阿姨': '#795548'
      };
      return borderColors[roleName] || '#9e9e9e';
    },

    setEventsFromWebSocket(events) {
      this.events = events;
    },

    addEventFromWebSocket(event) {
      // 检查是否已存在完全相同的事件
      const existingEventIndex = this.events.findIndex(e => 
        e._id === event._id ||
        (e.title === event.title && 
         e.startDate === event.startDate && 
         e.endDate === event.endDate && 
         e.role === event.role)
      );

      if (existingEventIndex === -1) {
        // 如果事件不存在，则添加它
        this.events.push(event);
      } else {
        // 如果事件已存在，更新它
        this.events[existingEventIndex] = event;
      }

      // 触发更新
      this.events = [...this.events];
      console.log('从 WebSocket 添加或更新事件:', event);
    },

    async addEvent(eventData) {
      const eventKey = `${eventData.title}-${eventData.startDate}`;
      if (this.pendingEvents.has(eventKey)) {
        console.log('事件正在添加中，忽略重复请求');
        return;
      }

      this.pendingEvents.add(eventKey);

      try {
        const response = await axios.post('/api/events', eventData);
        console.log('事件已添加到服务器:', response.data);
        return response.data;
      } catch (error) {
        console.error('添加事件失败:', error);
        throw error;
      } finally {
        this.pendingEvents.delete(eventKey);
      }
    },
    
    async updateEventCompletion(eventId, isCompleted) {
      try {
        const response = await axios.put(`/api/events/${eventId}/complete`, { completed: isCompleted });
        const updatedEvent = response.data.event;
        const index = this.events.findIndex(e => e._id === eventId);
        if (index !== -1) {
          this.events[index] = { ...this.events[index], ...updatedEvent };
        }
        return response.data.updatedStars;
      } catch (error) {
        console.error('更新事件完成状态失败:', error);
      }
    },
    
    async fetchWeeklyStars() {
      try {
        const response = await axios.get('/api/weekly-stars');
        const starData = response.data;
        this.familyMembers.forEach(member => {
          member.weeklyStars = starData[member.id] || 0;
        });
      } catch (error) {
        console.error('获取每周星星数据失败:', error);
      }
    },
    
    setSelectedDate(date) {
      this.selectedDate = date;
    },
    
    setSearchQuery(query) {
      this.searchQuery = query;
    },
    
    // 角色管理相关的 actions
    async addRole(roleName) {
      try {
        const response = await axios.post('/api/roles', { name: roleName });
        const newRole = {
          id: response.data._id,
          name: response.data.name,
          weeklyStars: 0,
          isDefault: false,
          color: this.getDefaultColor(response.data.name),
          borderColor: this.getDefaultBorderColor(response.data.name)
        };
        this.familyMembers.push(newRole);
      } catch (error) {
        console.error('添加角色失败:', error);
      }
    },
    
    async deleteRole(roleId) {
      try {
        await axios.delete(`/api/roles/${roleId}`);
        this.familyMembers = this.familyMembers.filter(member => member.id !== roleId);
      } catch (error) {
        console.error('删除角色失败:', error);
      }
    },
    
    async updateRole(roleId, newName) {
      try {
        await axios.put(`/api/roles/${roleId}`, { name: newName });
        const index = this.familyMembers.findIndex(member => member.id === roleId);
        if (index !== -1) {
          this.familyMembers[index].name = newName;
          this.familyMembers[index].color = this.getDefaultColor(newName);
          this.familyMembers[index].borderColor = this.getDefaultBorderColor(newName);
        }
      } catch (error) {
        console.error('更新角色失败:', error);
      }
    },
  }
});