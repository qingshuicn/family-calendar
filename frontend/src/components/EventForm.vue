<template>
    <div class="event-form">
      <textarea v-model="eventDescription" placeholder="描述你的事件（例如：明天下午3点开会）" rows="3"></textarea>
      <button @click="submitEvent">添加事件</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'EventForm',
    data() {
      return {
        eventDescription: ''
      }
    },
    methods: {
      async submitEvent() {
        try {
          const response = await axios.post('/ai-process', { description: this.eventDescription })
          this.$emit('event-added', response.data)
          this.eventDescription = ''
        } catch (error) {
          console.error('添加事件失败:', error)
          // 这里可以添加错误处理逻辑，比如显示一个错误消息
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .event-form {
    margin-top: 20px;
  }
  textarea {
    width: 100%;
    margin-bottom: 10px;
  }
  button {
    padding: 5px 10px;
  }
  </style>