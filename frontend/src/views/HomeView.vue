<template>
  <div class="home-view">
    <div class="header">
      <h1>家庭日程</h1>
      <CurrentDateTime />
    </div>
    <div class="layout">
      <div class="sidebar">
        <MonthlyCalendar 
          :events="events" 
          @date-selected="handleDateSelected"
          @search="handleSearch"
        />
        <FamilyTabs />
      </div>
      <div class="main-content">
        <ScheduleView :events="filteredEvents" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import FamilyTabs from '@/components/FamilyTabs.vue';
import ScheduleView from '@/components/ScheduleView.vue';
import CurrentDateTime from '@/components/CurrentDateTime.vue';
import MonthlyCalendar from '@/components/MonthlyCalendar.vue';

export default {
  name: 'HomeView',
  components: {
    FamilyTabs,
    ScheduleView,
    CurrentDateTime,
    MonthlyCalendar
  },
  setup() {
    const events = ref([]);
    const selectedDate = ref(null);
    const searchQuery = ref('');
    let ws;
    let isPolling = false;

    const filteredEvents = computed(() => {
      return events.value.filter(event => {
        const matchesDate = !selectedDate.value || new Date(event.date).toDateString() === selectedDate.value.toDateString();
        const matchesSearch = !searchQuery.value || event.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesDate && matchesSearch;
      });
    });

    function handleDateSelected(date) {
      selectedDate.value = date;
    }

    function handleSearch(query) {
      searchQuery.value = query;
    }

    const connectWebSocket = () => {
      const wsUrl = process.env.VUE_APP_WS_URL || 'ws://localhost:3000';
      console.log('尝试连接到 WebSocket:', wsUrl);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket 连接已建立');
        isPolling = false; // 重置轮询标志
      };

      ws.onmessage = (event) => {
        console.log('收到 WebSocket 消息:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'initial') {
            events.value = data.events;
          } else if (data.type === 'newEvent') {
            events.value.push(data.event);
          }
        } catch (error) {
          console.error('处理 WebSocket 消息时出错:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        if (!isPolling) {
          console.log('切换到轮询模式');
          pollForEvents();
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket 连接关闭。代码: ${event.code}, 原因: ${event.reason}`);
        if (!isPolling) {
          console.log('5秒后尝试重新连接...');
          setTimeout(connectWebSocket, 5000);
        }
      };
    };

    const pollForEvents = async () => {
      if (isPolling) return;
      isPolling = true;

      const poll = async () => {
        try {
          const response = await axios.get('/api/events');
          events.value = response.data;
          console.log('通过轮询获取到事件:', events.value);
        } catch (error) {
          console.error('轮询错误:', error);
        }

        if (isPolling) {
          setTimeout(poll, 5000); // 每5秒轮询一次
        }
      };

      poll();
    };

    onMounted(() => {
      connectWebSocket();
    });

    onUnmounted(() => {
      if (ws) {
        ws.close();
      }
      isPolling = false; // 确保在组件卸载时停止轮询
    });

    return {
      events,
      filteredEvents,
      handleDateSelected,
      handleSearch,
    };
  }
};
</script>

<style src="./HomeView.css" scoped></style>