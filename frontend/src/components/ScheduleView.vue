<template>
  <div class="schedule-view">
    <div class="time-axis">
      <div v-for="hour in timeSlots" :key="hour" class="time-slot">
        {{ formatHour(hour) }}
      </div>
    </div>
    <VirtualList
      class="events-container"
      :data-key="'id'"
      :data-sources="adjustedEvents"
      :data-component="EventItem"
      :estimate-size="60"
      :direction="'vertical'"
      @item-click="openCompletionDialog"
    />
    <div v-if="selectedEvent" class="completion-dialog">
      <div class="dialog-content">
        <h3>{{ selectedEvent.title }}</h3>
        <p v-if="!selectedEvent.completed">是否已完成此事件？</p>
        <p v-else>是否要取消此事件的完成状态？</p>
        <div class="dialog-buttons">
          <button @click="completeEvent(!selectedEvent.completed)">是</button>
          <button @click="closeDialog">否</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue';
import { useEventStore } from '@/stores/events';
import VirtualList from 'vue3-virtual-scroll-list';

const props = defineProps({
  events: {
    type: Array,
    required: true
  }
});

const eventStore = useEventStore();
const selectedEvent = ref(null);
const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6);

const useEventHelpers = () => {
  const getEventStyle = (event) => {
    const start = new Date(event.adjustedStartDate);
    const end = new Date(event.adjustedEndDate);
    const startPercentage = (start.getHours() + start.getMinutes() / 60 - 6) / 17 * 100;
    const heightPercentage = ((end.getHours() + end.getMinutes() / 60) - (start.getHours() + start.getMinutes() / 60)) / 17 * 100;

    return {
      top: `${startPercentage}%`,
      height: `${heightPercentage}%`,
      left: '60px',
      right: '10px',
      position: 'absolute'
    };
  };

  const getRoleClass = (role) => {
    const roleMap = {
      '爸爸': 'role-dad',
      '妈妈': 'role-mom',
      '哥哥': 'role-brother',
      '姐姐': 'role-sister',
      '弟弟': 'role-little-brother',
      '妹妹': 'role-little-sister',
      '阿姨': 'role-aunt'
    };
    return roleMap[role] || 'role-default';
  };

  const formatEventTime = (event) => {
    const start = new Date(event.adjustedStartDate);
    const end = new Date(event.adjustedEndDate);
    return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  };

  return { getEventStyle, getRoleClass, formatEventTime };
};

const EventItem = defineComponent({
  props: ['source'],
  setup(props) {
    const { getEventStyle, getRoleClass, formatEventTime } = useEventHelpers();

    return () => h('div', {
      class: 'event-item',
      style: getEventStyle(props.source),
    }, [
      h('div', { class: 'event-header' }, [
        h('span', { 
          class: ['event-role', getRoleClass(props.source.role)] 
        }, props.source.role),
        h('span', { 
          class: ['event-status', { 'completed': props.source.completed }] 
        }, props.source.completed ? '已完成' : '未完成')
      ]),
      h('div', { class: 'event-content' }, [
        h('h3', { class: 'event-title' }, props.source.title),
        h('p', { class: 'event-time' }, formatEventTime(props.source))
      ])
    ]);
  }
});

const adjustedEvents = computed(() => {
  return props.events.map(event => {
    const start = new Date(event.startDate);
    let end = new Date(event.endDate);
    
    if (end.getHours() >= 23 && end.getMinutes() > 0) {
      end = new Date(end.setHours(23, 0, 0, 0));
    }
    
    return { ...event, adjustedEndDate: end, adjustedStartDate: start, id: event._id };
  }).filter(event => {
    const startHour = new Date(event.adjustedStartDate).getHours();
    return startHour >= 6 && startHour < 23;
  });
});

const formatHour = (hour) => `${hour.toString().padStart(2, '0')}:00`;

const openCompletionDialog = (event) => {
  selectedEvent.value = event.source;
};

const closeDialog = () => {
  selectedEvent.value = null;
};

const completeEvent = async (isCompleted) => {
  if (selectedEvent.value) {
    try {
      const updatedStars = await eventStore.updateEventCompletion(selectedEvent.value._id, isCompleted);
      console.log(`事件 "${selectedEvent.value.title}" ${isCompleted ? '已完成' : '已取消完成'}`);
      if (updatedStars !== null) {
        console.log(`更新后的星星数: ${updatedStars}`);
      }
    } catch (error) {
      console.error('更新事件状态时发生错误:', error);
    }
    selectedEvent.value = null;
  }
};
</script>

<style scoped>
.schedule-view {
  display: flex;
  height: 100%;
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.time-axis {
  width: 60px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.time-slot {
  height: calc(100% / 17);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.events-container {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.event-item {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 4px 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.event-item:hover {
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.event-role {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
}

.event-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  background-color: #ffcccb;
  color: #d32f2f;
}

.event-status.completed {
  background-color: #c8e6c9;
  color: #388e3c;
}

.event-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-time {
  margin: 2px 0 0;
  font-size: 12px;
  color: #666;
}

.completion-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.dialog-buttons {
  margin-top: 20px;
}

.dialog-buttons button {
  margin: 0 10px;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dialog-buttons button:first-child {
  background-color: #4caf50;
  color: white;
}

.dialog-buttons button:last-child {
  background-color: #f44336;
  color: white;
}

/* 角色特定颜色 */
.role-dad { background-color: #4a90e2; color: white; }
.role-mom { background-color: #50e3c2; color: white; }
.role-brother { background-color: #f5a623; color: white; }
.role-sister { background-color: #b8e986; color: black; }
.role-little-brother { background-color: #bd10e0; color: white; }
.role-little-sister { background-color: #e2495f; color: white; }
.role-aunt { background-color: #9013fe; color: white; }
.role-default { background-color: #7ed321; color: white; }
</style>