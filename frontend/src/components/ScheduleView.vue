<template>
    <div class="schedule-view">
      <div class="time-column">
        <div v-for="hour in 24" :key="hour" class="time-slot">
          {{ formatHour(hour - 1) }}
        </div>
      </div>
      <div class="events-column">
        <div v-for="hour in 24" :key="hour" class="event-slot">
          <!-- 这里将来会显示具体的事件 -->
        </div>
      </div>
    </div>
  </template>
  
  <script src="./ScheduleView.js"></script>
  <style src="./ScheduleView.css" scoped></style>