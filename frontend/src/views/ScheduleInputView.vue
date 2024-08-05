<template>
  <div class="schedule-input-view">
    <textarea v-model="scheduleInput" placeholder="输入您的日程安排..." rows="4"></textarea>
    <button @click="submitSchedule">提交日程</button>
    <div v-if="response" class="response-area">
      <h3>响应：</h3>
      <pre>{{ response }}</pre>
    </div>
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
            schedule: this.scheduleInput
          },
          response_mode: "streaming",
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
          },
          responseType: 'stream'
        });

        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        
        try {
          for await (const chunk of this.readStreamByChunk(reader)) {
            const decodedChunk = decoder.decode(chunk);
            const events = decodedChunk.split('\n\n');
            
            for (const event of events) {
              if (event.startsWith('data: ')) {
                const jsonData = JSON.parse(event.slice(6));
                this.handleStreamEvent(jsonData);
              }
            }
          }
        } catch (error) {
          console.error('读取流时发生错误:', error);
        }

      } catch (error) {
        console.error('提交日程时出错:', error.message);
        if (error.response) {
          console.error('错误数据:', error.response.data);
          console.error('错误状态:', error.response.status);
          console.error('错误头部:', error.response.headers);
        } else if (error.request) {
          console.error('未收到响应:', error.request);
        }
        this.response = '发生错误: ' + error.message;
      }
    },
    async *readStreamByChunk(reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield value;
      }
    },
    handleStreamEvent(event) {
      console.log('收到事件:', event);
      switch (event.event) {
        case 'workflow_started':
          this.response = '工作流开始执行...';
          break;
        case 'node_started':
          this.response += `\n节点 "${event.data.title}" 开始执行...`;
          break;
        case 'node_finished':
          this.response += `\n节点 "${event.data.title}" 执行完成。状态: ${event.data.status}`;
          if (event.data.outputs) {
            this.response += `\n输出: ${JSON.stringify(event.data.outputs)}`;
          }
          break;
        case 'workflow_finished':
          this.response += `\n工作流执行完成。状态: ${event.data.status}`;
          if (event.data.outputs) {
            this.response += `\n最终输出: ${JSON.stringify(event.data.outputs)}`;
          }
          break;
        // 可以根据需要处理其他事件类型
      }
    }
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
  .response-area {
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    white-space: pre-wrap;
  }
  </style>