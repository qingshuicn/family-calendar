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
  const cache = await caches.open('sync-events');
  const keys = await cache.keys();
  return Promise.all(keys.map(async (key) => {
    const response = await cache.match(key);
    const event = await response.json();
    try {
      // 这里应该是您的同步逻辑，例如发送到服务器
      const serverResponse = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (serverResponse.ok) {
        await cache.delete(key);
      }
    } catch (error) {
      console.error('同步失败:', error);
    }
  }));
}

// 推送通知
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/img/icons/android-chrome-192x192.png'
  });
});