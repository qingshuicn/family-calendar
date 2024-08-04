import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './registerServiceWorker'

// 配置 axios 默认 URL
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

const app = createApp(App)
app.use(router)

// 保持屏幕常亮
const keepAwake = () => {
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then(() => {
      console.log('Screen will stay awake')
    }).catch((err) => {
      console.error(`${err.name}, ${err.message}`)
    })
  } else {
    console.warn('Wake Lock API not supported')
  }
}

app.mount('#app')
keepAwake()