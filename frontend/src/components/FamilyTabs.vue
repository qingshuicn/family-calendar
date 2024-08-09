<template>
  <div class="family-tabs">
    <div class="member-list">
      <div 
        v-for="member in sortedFamilyMembers" 
        :key="member.id"
        :class="['member-tab', { active: member.name === eventStore.selectedMember }]"
        @click="selectMember(member.name)"
        :style="{ backgroundColor: member.color, borderColor: member.borderColor }"
      >
        <div class="avatar-container">
          <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="member-avatar">
          <div v-else class="avatar-placeholder"></div>
        </div>
        <div class="member-info">
          <span class="member-name">{{ member.name }}</span>
          <span class="star">⭐ {{ member.weeklyStars }}</span>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <button @click="openAddEventModal" class="add-event-btn">添加日程</button>
      <button @click="$emit('open-role-management')" class="manage-roles-btn">管理角色</button>
    </div>
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

<style scoped>
.family-tabs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.member-tab {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid;
}

.member-tab.active {
  filter: brightness(90%);
}

.avatar-container {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.member-avatar, .avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background-color: white;
  border: 1px solid #e0e0e0;
}

.member-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.member-name {
  font-weight: bold;
}

.star {
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-event-btn, .manage-roles-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  background-color: #4a0e4e; /* 统一使用深紫色背景 */
  color: white; /* 统一使用白色文字 */
}

.add-event-btn:hover, .manage-roles-btn:hover {
  filter: brightness(110%); /* 统一的悬停效果 */
}
</style>