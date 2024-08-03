<template>
  <div class="home-view">
    <div class="header">
      <h1>家庭日程</h1>
      <CurrentDateTime />
    </div>
    <div class="layout">
      <CalendarSidebar />
      <div class="main-content">
        <FamilyTabs />
        <ScheduleView />
      </div>
    </div>
  </div>
</template>

<script setup>
import CalendarSidebar from '@/components/CalendarSidebar.vue'
import FamilyTabs from '@/components/FamilyTabs.vue'
import ScheduleView from '@/components/ScheduleView.vue'
import CurrentDateTime from '@/components/CurrentDateTime.vue'
</script>

<style src="./HomeView.css" scoped></style>