import { ref } from 'vue'

export default {
  name: 'ScheduleView',
  setup() {
    const displayHours = ref([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])
    const events = ref([
      { id: 1, title: '早餐', start: '07:30', end: '08:00' },
      { id: 2, title: '工作会议', start: '10:00', end: '11:30' },
      { id: 3, title: '午餐', start: '12:00', end: '13:00' },
      { id: 4, title: '健身', start: '18:00', end: '19:30' },
    ])

    function formatHour(hour) {
      return `${hour.toString().padStart(2, '0')}:00`
    }

    function formatEventTime(event) {
      return `${event.start} - ${event.end}`
    }

    function getEventStyle(event) {
      const startHour = parseInt(event.start.split(':')[0])
      const startMinute = parseInt(event.start.split(':')[1])
      const endHour = parseInt(event.end.split(':')[0])
      const endMinute = parseInt(event.end.split(':')[1])

      const top = (startHour - 6 + startMinute / 60) * 60
      const height = ((endHour - startHour) + (endMinute - startMinute) / 60) * 60

      return {
        top: `${top}px`,
        height: `${height}px`
      }
    }

    return {
      displayHours,
      events,
      formatHour,
      formatEventTime,
      getEventStyle
    }
  }
}