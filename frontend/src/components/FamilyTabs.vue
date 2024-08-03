<template>
  <div class="family-tabs">
    <button 
      v-for="member in familyMembers" 
      :key="member.id"
      :class="['member-tab', { active: member.id === activeMember }]"
      @click="setActiveMember(member.id)"
    >
      {{ member.name }}
    </button>
    <button class="add-event-btn" @click="addEvent">+ 添加日程</button>
  </div>
</template>

<script src="./FamilyTabs.js"></script>
<style src="./FamilyTabs.css" scoped></style>