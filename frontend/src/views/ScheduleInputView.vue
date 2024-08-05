<template>
  <div class="schedule-input-view">
    <h2>日程安排输入</h2>
    <textarea v-model="scheduleInput" placeholder="输入您的日程安排..." rows="4"></textarea>
    <button @click="submitSchedule">提交日程</button>
    <div v-if="response" class="response-area">
      <h3>响应：</h3>
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios';

export default {
  name: 'ScheduleInputView',
  data() {
    return {
      scheduleInput: '',
      apiKey: 'app-zyuogN6iPjys8j4R7fTj8M2z',
      apiUrl: 'https://api.dify.ai/v1/workflows/run',
      appId: 'b36203ef-fcdc-4bdc-ac17-7f6d3e1f5dbe',
      userId: 'user-123', // 这里应该使用一个唯一的用户标识符
      response: null
    };
  },
  methods: {
    async submitSchedule() {
      try {
        console.log('正在发送请求...');
        console.log('API URL:', this.apiUrl);
        console.log('App ID:', this.appId);
        console.log('API Key (前5个字符):', this.apiKey.substring(0, 5));

        const requestBody = {
          inputs: {
            text: this.scheduleInput
          },
          response_mode: "blocking",
          user: this.userId
        };

        console.log('请求体:', JSON.stringify(requestBody));

        const response = await axios({
          method: 'post',
          url: this.apiUrl,
          data: requestBody,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey.trim()}`
          },
          params: {
            app_id: this.appId
          }
        });

        console.log('响应:', response.data);
        this.response = JSON.stringify(response.data, null, 2);

      } catch (error) {
        console.error('提交日程时出错:', error.message);
        if (error.response) {
          console.error('错误数据:', error.response.data);
          console.error('错误状态:', error.response.status);
          console.error('错误头部:', error.response.headers);
          this.response = '错误: ' + JSON.stringify(error.response.data, null, 2);
        } else if (error.request) {
          console.error('未收到响应:', error.request);
          this.response = '错误: 未收到服务器响应';
        } else {
          this.response = '错误: ' + error.message;
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleStreamEvent(event) {
      // 此方法暂时保留，以便将来可能的流式处理
      console.log('收到事件:', event);
    }
  }
};
</script>

<style scoped>
.schedule-input-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

button {
  background-color: #4a0e4e;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3a0b3e;
}

.response-area {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9f9f9;
}

.response-area h3 {
  margin-top: 0;
  color: #333;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
</style>