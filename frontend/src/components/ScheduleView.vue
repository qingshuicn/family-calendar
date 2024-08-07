<template>
  <div class="schedule-view">
    <div class="time-column" ref="timeColumn">
      <div v-for="hour in displayHours" :key="hour" class="time-slot">
        <span class="hour-label">{{ formatHour(hour) }}</span>
        <div v-for="minute in [0, 15, 30, 45]" :key="minute" class="minute-mark"></div>
      </div>
    </div>
    <div class="events-column" ref="eventsColumn" @scroll="handleScroll">
      <div class="events-content">
        <div v-for="hour in displayHours" :key="hour" class="hour-slot">
          <div v-for="minute in [0, 15, 30, 45]" :key="minute" class="minute-slot"></div>
        </div>
        <div 
          v-for="(group, groupIndex) in processedEvents" 
          :key="groupIndex"
          class="event-group"
        >
          <div 
            v-for="(event, eventIndex) in group" 
            :key="event.startDate + event.title"
            class="event"
            :style="getEventStyle(event, eventIndex, group.length)"
            :class="getRoleClass(event.role)"
          >
            <h3>{{ event.title }}</h3>
            <p>{{ formatEventTime(event) }}</p>
            <p class="event-description">{{ event.description }}</p>
          </div>
        </div>
        <div class="current-time-line" :style="currentTimeLineStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  events: {
    type: Array,
    required: true
  }
});

const timeColumn = ref(null);
const eventsColumn = ref(null);
const currentTime = ref(new Date());

const displayHours = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 to 22:00

const formatHour = (hour) => `${hour.toString().padStart(2, '0')}:00`;

const formatEventTime = (event) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
};

const processedEvents = computed(() => {
  const sortedEvents = [...props.events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const groups = [];
  let currentGroup = [];

  for (const event of sortedEvents) {
    if (currentGroup.length === 0) {
      currentGroup.push(event);
    } else {
      const lastEvent = currentGroup[currentGroup.length - 1];
      if (new Date(event.startDate) < new Date(lastEvent.endDate)) {
        currentGroup.push(event);
      } else {
        groups.push(currentGroup);
        currentGroup = [event];
      }
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups;
});

const getEventStyle = (event, index, totalEvents) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const startMinutes = (start.getHours() - 6) * 60 + start.getMinutes();
  const durationMinutes = (end - start) / 60000;

  const width = `${100 / totalEvents}%`;
  const left = `${(index / totalEvents) * 100}%`;

  return {
    top: `${startMinutes}px`,
    height: `${durationMinutes}px`,
    width,
    left,
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

const currentTimeLineStyle = computed(() => {
  const minutes = (currentTime.value.getHours() - 6) * 60 + currentTime.value.getMinutes();
  return { top: `${minutes}px` };
});

const updateCurrentTime = () => {
  currentTime.value = new Date();
};

let timer;

onMounted(() => {
  if (eventsColumn.value) {
    eventsColumn.value.addEventListener('scroll', handleScroll);
  }
  timer = setInterval(updateCurrentTime, 60000); // Update every minute
});

onUnmounted(() => {
  if (eventsColumn.value) {
    eventsColumn.value.removeEventListener('scroll', handleScroll);
  }
  clearInterval(timer);
});

function handleScroll(event) {
  if (timeColumn.value) {
    timeColumn.value.scrollTop = event.target.scrollTop;
  }
}
</script>

<style scoped>
.schedule-view {
  display: flex;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.time-column {
  width: 60px;
  border-right: 1px solid #f0f0f0;
  background-color: #fafafa;
  z-index: 1;
  overflow-y: hidden;
}

.events-column {
  flex-grow: 1;
  position: relative;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.events-column::-webkit-scrollbar { 
  width: 0;
  height: 0;
  display: none;
}

.events-content {
  position: relative;
}

.time-slot, .hour-slot {
  height: 60px;
  position: relative;
}

.hour-label {
  position: absolute;
  top: -7px;
  left: 5px;
  font-size: 12px;
  color: #666;
}

.minute-mark, .minute-slot {
  height: 15px;
  border-bottom: 1px dashed #f0f0f0;
}

.minute-mark:last-child, .minute-slot:last-child {
  border-bottom: none;
}

.event-group {
  position: absolute;
  left: 0;
  right: 0;
}

.event {
  position: absolute;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.event h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-description {
  font-style: italic;
}

.current-time-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #f44336;
  z-index: 2;
}

/* 为不同角色添加不同的颜色 */
.event.role-dad { border-left: 4px solid #2196f3; background-color: #e3f2fd; }
.event.role-mom { border-left: 4px solid #4caf50; background-color: #e8f5e9; }
.event.role-brother { border-left: 4px solid #ff9800; background-color: #fff3e0; }
.event.role-sister { border-left: 4px solid #9c27b0; background-color: #f3e5f5; }
.event.role-little-brother { border-left: 4px solid #795548; background-color: #efebe9; }
.event.role-little-sister { border-left: 4px solid #e91e63; background-color: #fce4ec; }
.event.role-aunt { border-left: 4px solid #009688; background-color: #e0f2f1; }
.event.role-default { border-left: 4px solid #607d8b; background-color: #eceff1; }
</style>