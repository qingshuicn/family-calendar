/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered (registration) {
      console.log('Service worker has been registered.')
      // 检查更新
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60); // 每小时检查一次更新
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')
      // 提示用户刷新页面
      const newWorker = registration.waiting;
      if (window.confirm('新版本可用。是否刷新页面？')) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}