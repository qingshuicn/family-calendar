<template>
    <div class="family-schedule">
      <FamilyTabs @select-member="handleMemberSelect" />
      <ScheduleView :selectedMember="selectedMember" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import FamilyTabs from './FamilyTabs.vue';
  import ScheduleView from './ScheduleView.vue';
  
  const selectedMember = ref(null);
  
  const handleMemberSelect = (memberId) => {
    selectedMember.value = memberId;
  };
  </script>
  
  <style scoped>
  .family-schedule {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  </style>