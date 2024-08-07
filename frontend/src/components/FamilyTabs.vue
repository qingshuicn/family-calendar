<template>
  <div class="family-tabs">
    <div 
      v-for="member in familyMembers" 
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
import { ref, onMounted } from 'vue'
import EventModal from './EventModal.vue'
import axios from 'axios'

export default {
  name: 'FamilyTabs',
  components: {
    EventModal
  },
  setup() {
    const familyMembers = ref([
      { id: 'dad', name: '爸爸', avatar: '/avatars/dad.png', weeklyStars: 0 },
      { id: 'mom', name: '妈妈', avatar: '/avatars/mom.png', weeklyStars: 0 },
      { id: 'son', name: '弟弟', avatar: '/avatars/son.png', weeklyStars: 0 },
      { id: 'daughter', name: '姐姐', avatar: '/avatars/daughter.png', weeklyStars: 0 },
      { id: 'grandma', name: '阿姨', avatar: '/avatars/grandma.png', weeklyStars: 0 },
    ])

    const selectedMember = ref(null)
    const showEventModal = ref(false)

    async function fetchWeeklyStars() {
      try {
        const response = await axios.get('http://localhost:3000/api/weekly-stars')
        const starData = response.data
        familyMembers.value.forEach(member => {
          member.weeklyStars = starData[member.id] || 0
        })
      } catch (error) {
        console.error('获取每周星星数据失败:', error)
      }
    }

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
        const response = await axios.post('http://localhost:3000/api/events', eventData)
        console.log('新事件已创建:', response.data)
        
        // 更新星星数
        await updateStars(eventData.role)
        
        closeAddEventModal()
      } catch (error) {
        console.error('创建新事件失败:', error)
      }
    }

    async function updateStars(role) {
      try {
        const response = await axios.post('http://localhost:3000/api/update-stars', { role })
        const updatedStars = response.data.stars
        const memberIndex = familyMembers.value.findIndex(m => m.id === role)
        if (memberIndex !== -1) {
          familyMembers.value[memberIndex].weeklyStars = updatedStars
        }
      } catch (error) {
        console.error('更新星星失败:', error)
      }
    }

    onMounted(fetchWeeklyStars)

    return {
      familyMembers,
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