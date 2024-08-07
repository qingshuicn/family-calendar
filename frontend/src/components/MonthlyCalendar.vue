<template>
  <div class="monthly-calendar">
    <div class="calendar-header">
      <button @click="previousMonth">&lt;</button>
      <span>{{ currentMonthYear }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      <div v-for="day in calendarDays" :key="day.date" 
           :class="['calendar-day', { 'current-month': day.isCurrentMonth, 'today': day.isToday, 'has-events': day.hasEvents }]"
           @click="selectDate(day)">
        {{ day.date }}
        <div v-if="day.hasEvents" class="event-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'MonthlyCalendar',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const currentDate = ref(new Date())
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']

    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleString('zh-CN', { year: 'numeric', month: 'long' })
    })

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days = []
      const today = new Date()

      // Add days from previous month
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = new Date(year, month, -i)
        days.push({
          date: day.getDate(),
          isCurrentMonth: false,
          isToday: false,
          hasEvents: false
        })
      }

      // Add days of current month
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(year, month, i)
        days.push({
          date: i,
          isCurrentMonth: true,
          isToday: day.toDateString() === today.toDateString(),
          hasEvents: false
        })
      }

      // Add days from next month
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          isCurrentMonth: false,
          isToday: false,
          hasEvents: false
        })
      }

      // Check for events
      days.forEach(day => {
        day.hasEvents = props.events.some(event => {
          const eventDate = new Date(event.date)
          return eventDate.getDate() === day.date &&
                 eventDate.getMonth() === month &&
                 eventDate.getFullYear() === year
        })
      })

      return days
    })

    function previousMonth() {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
    }

    function nextMonth() {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
    }

    function selectDate(day) {
      if (day.isCurrentMonth) {
        const selectedDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day.date)
        emit('date-selected', selectedDate)
      }
    }

    return {
      currentMonthYear,
      weekdays,
      calendarDays,
      previousMonth,
      nextMonth,
      selectDate
    }
  }
}
</script>

<style scoped>
.monthly-calendar {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 8px;
  font-size: 0.9em;
  max-width: 280px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 1em;
  cursor: pointer;
  color: #4a0e4e;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: #4a0e4e;
  font-size: 0.8em;
  padding: 4px 0;
}

.calendar-day {
  text-align: center;
  padding: 4px 0;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  font-size: 0.9em;
}

.current-month {
  background-color: #f5f5f5;
}

.today {
  background-color: #4a0e4e;
  color: white;
}

.has-events::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #4a0e4e;
}

.calendar-day:not(.current-month) {
  color: #ccc;
}
</style>