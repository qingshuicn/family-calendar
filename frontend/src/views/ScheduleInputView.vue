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
          query: scheduleText.value,
          response_mode: "blocking",
          conversation_id: "",  // 如果需要保持对话上下文，可以提供一个唯一的会话ID
          user: "user123"  // 用户标识符
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.VUE_APP_DIFY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Schedule submitted:', response.data);
        
        // 处理响应
        if (response.data && response.data.answer) {
          alert(`日程已成功添加！API 响应: ${response.data.answer}`);
        } else {
          alert('日程已提交，但未收到预期的响应格式');
        }
        
        // 清除输入
        scheduleText.value = '';
      } catch (error) {
        console.error('Error submitting schedule:', error);
        if (error.response) {
          // 服务器响应了，但状态码不在 2xx 范围内
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          alert(`添加日程时出错: ${error.response.data.message || '未知错误'}`);
        } else if (error.request) {
          // 请求已经发出，但没有收到响应
          console.error('Error request:', error.request);
          alert('无法连接到服务器，请检查您的网络连接');
        } else {
          // 在设置请求时触发的错误
          console.error('Error message:', error.message);
          alert('发送请求时出错，请重试');
        }
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