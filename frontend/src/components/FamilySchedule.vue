// FamilySchedule.vue
<template>
  <div class="family-schedule">
    <FamilyTabs @select-member="handleMemberSelect" />
    <ScheduleView :selectedMember="selectedMember" />
  </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';
import { useEventStore } from '@/stores/events';
import FamilyTabs from './FamilyTabs.vue';
import ScheduleView from './ScheduleView.vue';

const eventStore = useEventStore();
const selectedMember = ref(null);
  
  const handleMemberSelect = (memberId) => {
    selectedMember.value = memberId;
  };

  watch(selectedMember, (newValue) => {
  eventStore.setSelectedMember(newValue);
});

  </script>
  
  <style scoped>
  .family-schedule {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  </style>