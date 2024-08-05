<template>
    <div class="schedule-input-view">
      <h1>输入日程</h1>
      <div class="schedule-input-container">
        <textarea
          v-model="scheduleText"
          placeholder="请输入您的日程安排..."
          rows="4"
          class="schedule-textarea"
        ></textarea>
        <button @click="submitSchedule" class="submit-button" :disabled="!scheduleText">
          提交日程
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'ScheduleInputView',
    setup() {
      const scheduleText = ref('');
  
      const submitSchedule = async () => {
        if (!scheduleText.value) return;
  
        try {
          const response = await axios.post(process.env.VUE_APP_DIFY_API_URL, {
            inputs: {
              text: scheduleText.value
            },
            response_mode: "blocking",
            user: "abc-123"  // 这里应该使用实际的用户ID
          }, {
            headers: {
              'Authorization': `Bearer ${process.env.VUE_APP_DIFY_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
  
          console.log('Schedule submitted:', response.data);
          
          // 处理响应，可能需要根据实际 API 返回格式调整
          alert('日程已成功添加！');
          
          // 清除输入
          scheduleText.value = '';
        } catch (error) {
          console.error('Error submitting schedule:', error);
          alert('添加日程时出错，请重试。');
        }
      };
  
      return {
        scheduleText,
        submitSchedule
      };
    }
  };
  </script>
  
  <style scoped>
  .schedule-input-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    height: 100vh;
    background-color: #f5f7fa;
  }
  
  h1 {
    color: #4a0e4e;
    margin-bottom: 30px;
  }
  
  .schedule-input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 500px;
  }
  
  .schedule-textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    resize: vertical;
  }
  
  .submit-button {
    background-color: #4a0e4e;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
  }
  
  .submit-button:hover {
    background-color: #6a1c6e;
  }
  
  .submit-button:active {
    background-color: #3a0b3e;
  }
  
  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>