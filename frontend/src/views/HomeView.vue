<template>
  <div class="home-view">
    <header class="header">
      <h1>家庭日程</h1>
      <CurrentDateTime />
    </header>
    <div class="layout">
      <div class="sidebar">
        <MonthlyCalendar 
          :events="eventStore.events" 
          @date-selected="handleDateSelected"
          @search="handleSearch"
        />
        <FamilyTabs />
      </div>
      <div class="main-content">
        <ScheduleView :events="eventStore.filteredEvents" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch } from 'vue';
import { useEventStore } from '@/stores/events';
import FamilyTabs from '@/components/FamilyTabs.vue';
import ScheduleView from '@/components/ScheduleView.vue';
import CurrentDateTime from '@/components/CurrentDateTime.vue';
import MonthlyCalendar from '@/components/MonthlyCalendar.vue';
import useWebSocket from '../composables/useWebSocket';

export default {
  name: 'HomeView',
  components: {
    FamilyTabs,
    ScheduleView,
    CurrentDateTime,
    MonthlyCalendar
  },
  setup() {
    const eventStore = useEventStore();
    const { connectWebSocket, disconnectWebSocket } = useWebSocket(eventStore);

    function handleDateSelected(date) {
      eventStore.setSelectedDate(date);
    }

    function handleSearch(query) {
      eventStore.setSearchQuery(query);
    }

    onMounted(() => {
      eventStore.fetchEvents();
      eventStore.fetchWeeklyStars();
      connectWebSocket();
    });

    onUnmounted(() => {
      disconnectWebSocket();
    });

    // 监听 eventStore.events 的变化
    watch(() => eventStore.events, () => {
      console.log('Events updated:', eventStore.events.length);
    }, { deep: true });

    // 监听 eventStore.filteredEvents 的变化
    watch(() => eventStore.filteredEvents, () => {
      console.log('Filtered events updated:', eventStore.filteredEvents.length);
    }, { deep: true });

    return {
      eventStore,
      handleDateSelected,
      handleSearch,
    };
  }
};
</script>

<style src="./HomeView.css" scoped></style>