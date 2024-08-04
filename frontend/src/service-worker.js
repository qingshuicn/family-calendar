import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// 缓存 API 请求
registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache'
  })
);

// 缓存静态资源
registerRoute(
  ({request}) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-events') {
    event.waitUntil(syncNewEvents());
  }
});

async function syncNewEvents() {
  // 同步逻辑...
}

// 推送通知
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/img/icons/android-chrome-192x192.png'
      })
    );
  }
});

// 添加安装事件监听器
// eslint-disable-next-line no-unused-vars
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

// 添加激活事件监听器
// eslint-disable-next-line no-unused-vars
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});