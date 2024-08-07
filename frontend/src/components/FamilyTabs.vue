<template>
  <div class="family-tabs">
    <div 
      v-for="member in eventStore.familyMembers" 
      :key="member.id"
      :class="['member-tab', { active: member.id === selectedMember }]"
      @click="selectMember(member.id)"
    >
      <img :src="member.avatar" :alt="member.name" class="member-avatar">
      <div class="member-info">
        <span class="member-name">{{ member.name }}</span>
        <div class="achievement-icons">
          <span class="star">⭐ {{ member.weeklyStars }}</span>
        </div>
      </div>
    </div>
    <button class="add-event-btn" @click="openAddEventModal">添加日程</button>
    <EventModal 
      v-if="showEventModal"
      :selectedMember="selectedMember"
      @close="closeAddEventModal"
      @submit="submitNewEvent"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useEventStore } from '@/stores/events'
import EventModal from './EventModal.vue'

export default {
  name: 'FamilyTabs',
  components: {
    EventModal
  },
  setup() {
    const eventStore = useEventStore()
    const selectedMember = ref(null)
    const showEventModal = ref(false)

    function selectMember(memberId) {
      selectedMember.value = memberId
    }

    function openAddEventModal() {
      showEventModal.value = true
    }

    function closeAddEventModal() {
      showEventModal.value = false
    }

    async function submitNewEvent(eventData) {
      try {
        await eventStore.addEvent(eventData)
        closeAddEventModal()
      } catch (error) {
        console.error('创建新事件失败:', error)
      }
    }

    return {
      eventStore,
      selectedMember,
      showEventModal,
      selectMember,
      openAddEventModal,
      closeAddEventModal,
      submitNewEvent
    }
  }
}
</script>

<style src="./FamilyTabs.css" scoped></style>