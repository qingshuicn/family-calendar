import { defineStore } from 'pinia'
import axios from 'axios'

export const useEventStore = defineStore('events', {
  state: () => ({
    familyMembers: [],
    events: [],
    selectedMember: null,
    selectedDate: new Date(),
    searchQuery: '',
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
        
        console.log(`Event: ${event.title}, Role: ${event.role}, Selected: ${state.selectedMember}, Matches: ${matchesMember}, Date: ${matchesDate}`);
        
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
          isDefault: role.isDefault
        }));
      } catch (error) {
        console.error('获取家庭成员失败:', error);
      }
    },

    setEventsFromWebSocket(events) {
      this.events = events;
    },

    addEventFromWebSocket(event) {
      this.events.push(event);
      this.events = [...this.events]; // 触发数组变化
      console.log('从 WebSocket 添加新事件:', event);
    },

    async addEvent(eventData) {
      try {
        const response = await axios.post('/api/events', eventData);
        console.log('事件已添加到服务器:', response.data);
        // 不需要在这里手动添加事件到 events 数组
        // WebSocket 会处理这个操作
        return response.data;
      } catch (error) {
        console.error('添加事件失败:', error);
        throw error;
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
          isDefault: false
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
        }
      } catch (error) {
        console.error('更新角色失败:', error);
      }
    },
  }
});