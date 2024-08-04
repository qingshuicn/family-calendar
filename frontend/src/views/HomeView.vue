<template>
  <div class="home-view">
    <div class="header">
      <h1>家庭日程</h1>
      <CurrentDateTime />
    </div>
    <div class="layout">
      <CalendarSidebar />
      <div class="main-content">
        <FamilyTabs />
        <ScheduleView :events="events" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import CalendarSidebar from '@/components/CalendarSidebar.vue';
import FamilyTabs from '@/components/FamilyTabs.vue';
import ScheduleView from '@/components/ScheduleView.vue';
import CurrentDateTime from '@/components/CurrentDateTime.vue';

const events = ref([]);
let ws;

const connectWebSocket = () => {
  const wsUrl = process.env.VUE_APP_WS_URL || 'ws://localhost:3000';
  console.log('尝试连接到 WebSocket:', wsUrl);
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket 连接已建立');
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
    // 在这里可以添加回退到轮询的逻辑
    pollForEvents();
  };

  ws.onclose = () => {
    console.log('WebSocket 连接关闭，5秒后尝试重新连接...');
    setTimeout(connectWebSocket, 5000);
  };
};

const pollForEvents = async () => {
  try {
    const response = await axios.get('/api/events');
    events.value = response.data;
    console.log('通过轮询获取到事件:', events.value);
    setTimeout(pollForEvents, 5000); // 每5秒轮询一次
  } catch (error) {
    console.error('轮询错误:', error);
    setTimeout(pollForEvents, 5000); // 出错时也继续轮询
  }
};

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});
</script>

<style src="./HomeView.css" scoped></style>