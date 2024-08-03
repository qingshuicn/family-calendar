export default {
    name: 'ScheduleView',
    setup() {
      function formatHour(hour) {
        return `${hour.toString().padStart(2, '0')}:00`
      }
  
      return {
        formatHour
      }
    }
  }