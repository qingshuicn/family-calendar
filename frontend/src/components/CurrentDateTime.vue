<template>
    <div class="current-date-time">
      {{ formattedDateTime }}
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const formattedDateTime = ref('')
  
  function updateDateTime() {
    const now = new Date()
    const date = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    formattedDateTime.value = `${date} ${time}`
  }
  
  let timer
  onMounted(() => {
    updateDateTime()
    timer = setInterval(updateDateTime, 60000) // 每分钟更新一次
  })
  
  onUnmounted(() => {
    clearInterval(timer)
  })
  </script>
  
  <style scoped>
  .current-date-time {
    font-size: 1em;
    color: #4a0e4e;
    white-space: nowrap;
  }
  </style>