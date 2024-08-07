<template>
  <div class="family-tabs">
    <div 
      v-for="member in familyMembers" 
      :key="member.id"
      :class="['member-tab', { active: member.id === activeMember }]"
      @click="selectMember(member.id)"
    >
      <img :src="member.avatar" :alt="member.name" class="member-avatar">
      <div class="member-info">
        <span class="member-name">{{ member.name }}</span>
        <div class="achievement-icons">
          <span v-for="(count, type) in member.achievements" :key="type" :class="type">
            {{ getAchievementIcon(type) }}
          </span>
          <span class="stars">{{ '⭐'.repeat(member.stars) }}</span>
        </div>
      </div>
    </div>
    <button class="add-event-btn" @click="addEvent">+ 添加日程</button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'FamilyTabs',
  setup() {
    const familyMembers = ref([
      { id: 'dad', name: '爸爸', avatar: '/avatars/dad.png', stars: 3, achievements: { moon: 2, sun: 1, crown: 0 } },
      { id: 'mom', name: '妈妈', avatar: '/avatars/mom.png', stars: 4, achievements: { moon: 3, sun: 1, crown: 0 } },
      { id: 'son', name: '弟弟', avatar: '/avatars/son.png', stars: 1, achievements: { moon: 0, sun: 0, crown: 0 } },
      { id: 'daughter', name: '姐姐', avatar: '/avatars/daughter.png', stars: 2, achievements: { moon: 1, sun: 0, crown: 0 } },
      { id: 'grandma', name: '阿姨', avatar: '/avatars/grandma.png', stars: 0, achievements: { moon: 0, sun: 0, crown: 0 } },
    ])
    const activeMember = ref(null)
    let autoSwitchTimer = null

    function selectMember(memberId) {
      activeMember.value = memberId
      if (autoSwitchTimer) {
        clearTimeout(autoSwitchTimer)
      }
      autoSwitchTimer = setTimeout(() => {
        activeMember.value = null
      }, 30000) // 30秒后自动切换回所有成员视图
    }

    function addEvent() {
      // 实现添加事件的逻辑
      console.log('添加新事件')
    }

    function getAchievementIcon(type) {
      switch (type) {
        case 'moon': return '🌙'
        case 'sun': return '☀️'
        case 'crown': return '👑'
        default: return ''
      }
    }

    onMounted(() => {
      // 默认显示所有人的日程，不需要额外操作
    })

    onUnmounted(() => {
      if (autoSwitchTimer) {
        clearTimeout(autoSwitchTimer)
      }
    })

    return {
      familyMembers,
      activeMember,
      selectMember,
      addEvent,
      getAchievementIcon
    }
  },
  emits: ['update:selectedMember']
}
</script>

<style src="./FamilyTabs.css" scoped></style>