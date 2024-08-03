import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 配置 axios 默认 URL
axios.defaults.baseURL = 'http://localhost:3000'  // 假设后端运行在 3000 端口

const app = createApp(App)
app.use(router)
app.mount('#app')