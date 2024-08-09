<template>
  <div class="event-block-view">
    <div v-for="event in sortedEvents" :key="getEventKey(event)" class="event-block" :style="getEventStyle(event)">
      <div class="event-time">{{ formatEventTime(event) }}</div>
      <div class="event-content">
        <h3>{{ event.title }}</h3>
        <p class="event-description">{{ event.description }}</p>
        <p class="event-role">{{ event.role }}</p>
      </div>
      <div class="event-actions">
        <button @click="toggleEventCompletion(event)" :class="{ completed: event.completed }">
          {{ event.completed ? '已完成' : '完成' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useEventStore } from '@/stores/events';

const eventStore = useEventStore();

const sortedEvents = computed(() => {
  return [...eventStore.filteredEvents].sort((a, b) => {
    // 首先按开始时间排序
    const timeCompare = new Date(a.startDate) - new Date(b.startDate);
    if (timeCompare !== 0) return timeCompare;
    
    // 如果开始时间相同，按角色排序
    return a.role.localeCompare(b.role);
  });
});

function getEventKey(event) {
  // 使用事件的唯一属性组合作为 key
  return `${event._id}-${event.startDate}-${event.endDate}-${event.role}-${event.title}`;
}

function formatEventTime(event) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  return `${start.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
}

function getEventStyle(event) {
  const member = eventStore.familyMembers.find(m => m.name === event.role);
  return {
    backgroundColor: member ? `${member.color}33` : '#e1f5fe33',
    borderLeft: `4px solid ${member ? member.borderColor : '#03a9f4'}`,
  };
}

async function toggleEventCompletion(event) {
  try {
    const updatedStars = await eventStore.updateEventCompletion(event._id, !event.completed);
    console.log('Updated stars:', updatedStars);
  } catch (error) {
    console.error('更新事件完成状态失败:', error);
  }
}
</script>

<style scoped>
.event-block-view {
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.event-block {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.event-time {
  flex: 0 0 100px;
  font-weight: bold;
}

.event-content {
  flex: 1;
  margin: 0 10px;
}

.event-content h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.event-description, .event-role {
  margin: 0;
  font-size: 14px;
}

.event-actions {
  flex: 0 0 80px;
  text-align: right;
}

.event-actions button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4a0e4e;
  color: white;
  font-size: 12px;
}

.event-actions button.completed {
  background-color: #4caf50;
}
</style>