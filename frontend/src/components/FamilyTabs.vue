<!-- FamilyTabs.vue -->
<template>
  <div class="family-tabs">
    <div 
      v-for="member in sortedFamilyMembers" 
      :key="member.id"
      :class="['member-tab', { active: member.name === eventStore.selectedMember }]"
      @click="selectMember(member.name)"
    >
      <img :src="member.avatar || defaultAvatar" :alt="member.name" class="member-avatar">
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
      :selectedMember="eventStore.selectedMember"
      @close="closeAddEventModal"
      @submit="submitNewEvent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useEventStore } from '@/stores/events'
import EventModal from './EventModal.vue'

const eventStore = useEventStore()
const showEventModal = ref(false)
let resetTimer = null

const defaultAvatar = '/path/to/default-avatar.png' // 设置一个默认头像路径

const sortedFamilyMembers = computed(() => {
  return [...eventStore.familyMembers].sort((a, b) => {
    if (a.name === '全家') return -1
    if (b.name === '全家') return 1
    return a.name.localeCompare(b.name)
  })
})

function selectMember(memberName) {
  if (eventStore.selectedMember === memberName) {
    eventStore.resetSelectedMember()
    clearTimeout(resetTimer)
    resetTimer = null
  } else {
    eventStore.setSelectedMember(memberName)
    resetAutoResetTimer()
  }
}

function resetAutoResetTimer() {
  if (resetTimer) {
    clearTimeout(resetTimer)
  }
  resetTimer = setTimeout(() => {
    eventStore.resetSelectedMember()
    resetTimer = null
  }, 30000) // 30秒后重置
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

onUnmounted(() => {
  if (resetTimer) {
    clearTimeout(resetTimer)
  }
})
</script>

<style src="./FamilyTabs.css" scoped></style>