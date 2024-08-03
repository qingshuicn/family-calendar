<template>
    <div class="calendar-sidebar">
      <div class="nav-buttons">
        <button @click="previousMonth">&lt;</button>
        <span>{{ currentMonthYear }}</span>
        <button @click="nextMonth">&gt;</button>
      </div>
      <div class="calendar">
        <div class="weekdays">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>
        <div class="days">
          <span v-for="day in calendarDays" :key="day.date" 
                :class="{ 'current-day': day.isToday, 'other-month': !day.isCurrentMonth }">
            {{ day.date }}
          </span>
        </div>
      </div>
      <input type="text" placeholder="搜索日程..." class="search-input">
    </div>
  </template>
  
  <script src="./CalendarSidebar.js"></script>
  <style src="./CalendarSidebar.css" scoped></style>