<template>
  <div class="schedule-view">
    <div class="time-column">
      <div v-for="hour in displayHours" :key="hour" class="time-slot">
        {{ formatHour(hour) }}
      </div>
    </div>
    <div class="events-column">
      <div v-for="hour in displayHours" :key="hour" class="event-slot">
        <!-- 背景网格线 -->
      </div>
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="event"
        :style="getEventStyle(event)"
      >
        <h3>{{ event.title }}</h3>
        <p>{{ formatEventTime(event) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  events: {
    type: Array,
    required: true
  }
});

const displayHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

function formatHour(hour) {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function formatEventTime(event) {
  return `${event.startDate.split('T')[1].slice(0, 5)} - ${event.endDate.split('T')[1].slice(0, 5)}`;
}

function getEventStyle(event) {
  const startHour = parseInt(event.startDate.split('T')[1].split(':')[0]);
  const startMinute = parseInt(event.startDate.split('T')[1].split(':')[1]);
  const endHour = parseInt(event.endDate.split('T')[1].split(':')[0]);
  const endMinute = parseInt(event.endDate.split('T')[1].split(':')[1]);

  const top = (startHour - 6 + startMinute / 60) * 60;
  const height = ((endHour - startHour) + (endMinute - startMinute) / 60) * 60;

  return {
    top: `${top}px`,
    height: `${height}px`
  };
}
</script>

<style src="./ScheduleView.css" scoped></style>