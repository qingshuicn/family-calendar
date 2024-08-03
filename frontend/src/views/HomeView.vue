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
import CalendarSidebar from '@/components/CalendarSidebar.vue';
import FamilyTabs from '@/components/FamilyTabs.vue';
import ScheduleView from '@/components/ScheduleView.vue';
import CurrentDateTime from '@/components/CurrentDateTime.vue';

const events = ref([]);
let ws;

const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:3000');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'initial') {
      events.value = data.events;
    } else if (data.type === 'newEvent') {
      events.value.push(data.event);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket连接关闭，尝试重新连接...');
    setTimeout(connectWebSocket, 5000);
  };
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