import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './registerServiceWorker'

// 配置 axios 默认 URL
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

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

// 检查并处理 Service Worker 更新
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          const shouldUpdate = window.confirm('新版本可用。是否立即更新？');
          if (shouldUpdate) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
}

app.mount('#app')
keepAwake()