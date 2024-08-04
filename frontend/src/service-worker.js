import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';

// 这行是必需的，不要删除
precacheAndRoute(self.__WB_MANIFEST);

// 缓存 API 请求
registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10, // 添加超时设置
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
  const cache = await caches.open('sync-events');
  const keys = await cache.keys();
  return Promise.all(keys.map(async (key) => {
    try {
      const response = await cache.match(key);
      const event = await response.json();
      const serverResponse = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (serverResponse.ok) {
        await cache.delete(key);
        console.log('Event synced successfully:', event);
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('同步失败:', error);
      // 可以在这里添加重试逻辑
    }
  }));
}

// 推送通知
self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/img/icons/android-chrome-192x192.png'
      })
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// 添加安装事件监听器
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

// 添加激活事件监听器
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});