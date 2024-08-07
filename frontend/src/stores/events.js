import { defineStore } from 'pinia'
import axios from 'axios'

export const useEventStore = defineStore('events', {
  state: () => ({
    events: [],
    selectedDate: null,
    searchQuery: '',
    familyMembers: [
      { id: 'dad', name: '爸爸', avatar: '/avatars/dad.png', weeklyStars: 0 },
      { id: 'mom', name: '妈妈', avatar: '/avatars/mom.png', weeklyStars: 0 },
      { id: 'son', name: '弟弟', avatar: '/avatars/son.png', weeklyStars: 0 },
      { id: 'daughter', name: '姐姐', avatar: '/avatars/daughter.png', weeklyStars: 0 },
      { id: 'grandma', name: '阿姨', avatar: '/avatars/grandma.png', weeklyStars: 0 },
    ]
  }),
  getters: {
    filteredEvents: (state) => {
      return state.events.filter(event => {
        const matchesDate = !state.selectedDate || new Date(event.date).toDateString() === state.selectedDate.toDateString();
        const matchesSearch = !state.searchQuery || event.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesDate && matchesSearch;
      });
    }
  },
  actions: {
    async fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        this.events = response.data;
      } catch (error) {
        console.error('获取事件失败:', error);
      }
    },
    async addEvent(eventData) {
      try {
        const response = await axios.post('/api/events', eventData);
        this.events.push(response.data);
      } catch (error) {
        console.error('添加事件失败:', error);
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
    }
  }
})