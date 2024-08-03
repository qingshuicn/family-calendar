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
      eventDescription: '',
      ws: null
    }
  },
  mounted() {
    this.connectWebSocket()
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close()
    }
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket('ws://localhost:3000')
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected. Trying to reconnect...')
        setTimeout(() => this.connectWebSocket(), 5000)
      }
    },
    async submitEvent() {
      try {
        const response = await axios.post('/ai-process', { description: this.eventDescription })
        
        // 发送事件到服务器，服务器会通过 WebSocket 广播给所有客户端
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'newEvent',
            event: response.data
          }))
        }
        
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