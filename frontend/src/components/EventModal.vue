<template>
    <div class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <h2>添加新日程</h2>
        <form @submit.prevent="submitEvent">
          <div class="form-group">
            <label for="title">标题：</label>
            <input id="title" v-model="eventData.title" required>
          </div>
          <div class="form-group">
            <label for="description">描述：</label>
            <textarea id="description" v-model="eventData.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="startTime">开始时间：</label>
            <select id="startTime" v-model="eventData.startTime" required>
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="endTime">结束时间：</label>
            <select id="endTime" v-model="eventData.endTime" required>
              <option v-for="time in endTimeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="role">角色：</label>
            <select id="role" v-model="eventData.role" required>
              <option value="全家">全家</option>
              <option value="爸爸">爸爸</option>
              <option value="妈妈">妈妈</option>
              <option value="弟弟">弟弟</option>
              <option value="姐姐">姐姐</option>
              <option value="阿姨">阿姨</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="close">取消</button>
            <button type="submit">提交</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch, onMounted } from 'vue'
  
  export default {
    name: 'EventModal',
    props: {
      selectedMember: String
    },
    emits: ['close', 'submit'],
    setup(props, { emit }) {
      const eventData = ref({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        role: '全家'  // 默认设置为"全家"
      })
  
      const timeSlots = ref([])
      const endTimeSlots = computed(() => {
        const startIndex = timeSlots.value.indexOf(eventData.value.startTime)
        return timeSlots.value.slice(startIndex + 1)
      })
  
      function generateTimeSlots() {
        const slots = []
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        
        for (let i = 0; i < 96; i++) { // 15分钟间隔，24小时共96个时间段
          const time = new Date(start.getTime() + i * 15 * 60000)
          slots.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
        }
        
        timeSlots.value = slots
      }
  
      function setDefaultTimes() {
        const now = new Date()
        const currentTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        
        // 找到最接近当前时间的时间段
        const closestTime = timeSlots.value.reduce((prev, curr) => {
          return Math.abs(new Date('1970/01/01 ' + curr) - new Date('1970/01/01 ' + currentTime)) < 
                 Math.abs(new Date('1970/01/01 ' + prev) - new Date('1970/01/01 ' + currentTime)) 
                 ? curr : prev
        })
        
        eventData.value.startTime = closestTime
        
        // 设置默认结束时间为开始时间后一小时
        const startIndex = timeSlots.value.indexOf(closestTime)
        const endIndex = Math.min(startIndex + 4, timeSlots.value.length - 1) // 默认一小时后，但不超过最后一个时间段
        eventData.value.endTime = timeSlots.value[endIndex]
      }
  
      onMounted(() => {
        generateTimeSlots()
        setDefaultTimes()
      })
  
      watch(() => props.selectedMember, (newValue) => {
        if (newValue) {
          eventData.value.role = newValue
        }
      }, { immediate: true })
  
      function close() {
        emit('close')
      }
  
      function submitEvent() {
        const today = new Date()
        const [startHours, startMinutes] = eventData.value.startTime.split(':')
        const [endHours, endMinutes] = eventData.value.endTime.split(':')
        
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(startHours), parseInt(startMinutes))
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(endHours), parseInt(endMinutes))
        
        // 如果结束时间小于开始时间，说明跨天了，结束日期加一天
        if (endDate < startDate) {
          endDate.setDate(endDate.getDate() + 1)
        }
  
        const formattedEvent = {
          title: eventData.value.title,
          description: eventData.value.description,
          startDate: startDate.toISOString().slice(0, 19), // 格式化为 "YYYY-MM-DDTHH:mm:ss"
          endDate: endDate.toISOString().slice(0, 19),     // 格式化为 "YYYY-MM-DDTHH:mm:ss"
          role: eventData.value.role
        }
  
        console.log('Submitting event:', formattedEvent); // 添加日志
        emit('submit', formattedEvent)
      }
  
      return {
        eventData,
        timeSlots,
        endTimeSlots,
        close,
        submitEvent
      }
    }
  }
  </script>
  
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 增加 z-index 确保模态框显示在最上层 */
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #4a0e4e;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }
  
  button[type="submit"] {
    background-color: #4a0e4e;
    color: white;
  }
  
  button[type="submit"]:hover {
    background-color: #3a0b3e;
  }
  
  button[type="button"] {
    background-color: #f0f0f0;
    color: #333;
  }
  
  button[type="button"]:hover {
    background-color: #e0e0e0;
  }
  </style>