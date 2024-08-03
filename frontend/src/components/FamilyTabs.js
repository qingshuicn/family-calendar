import { ref } from 'vue'

export default {
  name: 'FamilyTabs',
  setup() {
    const familyMembers = ref([
      { id: 'all', name: '全家' },
      { id: 'dad', name: '爸爸' },
      { id: 'mom', name: '妈妈' },
      { id: 'son', name: '弟弟' },
      { id: 'daughter', name: '姐姐' },
      { id: 'grandma', name: '阿姨' },
    ])
    const activeMember = ref('all')

    function setActiveMember(memberId) {
      activeMember.value = memberId
    }

    function addEvent() {
      // 实现添加事件的逻辑
      console.log('添加新事件')
    }

    return {
      familyMembers,
      activeMember,
      setActiveMember,
      addEvent
    }
  }
}