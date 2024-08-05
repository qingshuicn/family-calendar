<template>
  <div class="schedule-input-view">
    <textarea v-model="scheduleInput" placeholder="输入您的日程安排..." rows="4"></textarea>
    <button @click="submitSchedule">提交日程</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ScheduleInputView',
  data() {
    return {
      scheduleInput: '',
      apiKey: 'app-zyuogN6iPjys8j4R7fTj8M2z',
      apiUrl: 'https://api.dify.ai/v1/workflows/run'
    };
  },
  methods: {
    async submitSchedule() {
      try {
        console.log('正在发送请求...');
        console.log('API URL:', this.apiUrl);
        console.log('API Key:', this.apiKey);

        const requestBody = {
          inputs: {
            user_input: this.scheduleInput
          }
          // 注意：这里没有包含 workflow_id，因为您没有提供。如果需要，请添加它。
        };

        console.log('请求体:', JSON.stringify(requestBody));

        const response = await axios.post(this.apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.apiKey
          }
        });

        console.log('日程提交成功:', response.data);
        // 处理成功响应
      } catch (error) {
        console.error('提交日程时出错:', error);
        if (error.response) {
          console.error('错误数据:', error.response.data);
          console.error('错误状态:', error.response.status);
          console.error('错误头部:', error.response.headers);
        } else if (error.request) {
          console.error('未收到响应:', error.request);
        } else {
          console.error('错误信息:', error.message);
        }
        console.error('错误配置:', error.config);
      }
    }
  },
  mounted() {
    console.log('组件已挂载');
    console.log('API URL:', this.apiUrl);
    console.log('API Key:', this.apiKey);
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