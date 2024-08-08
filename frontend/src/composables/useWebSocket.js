import { ref } from 'vue';

export default function useWebSocket(eventStore) {
  const ws = ref(null);
  const isPolling = ref(false);

  const connectWebSocket = () => {
    const wsUrl = process.env.VUE_APP_WS_URL || 'ws://localhost:3000';
    console.log('尝试连接到 WebSocket:', wsUrl);
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => {
      console.log('WebSocket 连接已建立');
      isPolling.value = false;
    };

    ws.value.onmessage = (event) => {
      console.log('收到 WebSocket 消息:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'initial') {
          // 使用新的 setEventsFromWebSocket 方法
          eventStore.setEventsFromWebSocket(data.events);
        } else if (data.type === 'newEvent') {
          eventStore.events.push(data.event);
        } else if (data.type === 'updateEvent') {
          const index = eventStore.events.findIndex(e => e._id === data.event._id);
          if (index !== -1) {
            eventStore.events[index] = data.event;
          }
        }
        // 每次接收到新的事件数据时，更新过滤后的事件列表
        eventStore.$patch({ events: [...eventStore.events] });
      } catch (error) {
        console.error('处理 WebSocket 消息时出错:', error);
      }
    };

    ws.value.onerror = (error) => {
      console.error('WebSocket 错误:', error);
      if (!isPolling.value) {
        console.log('切换到轮询模式');
        pollForEvents();
      }
    };

    ws.value.onclose = (event) => {
      console.log(`WebSocket 连接关闭。代码: ${event.code}, 原因: ${event.reason}`);
      if (!isPolling.value) {
        console.log('5秒后尝试重新连接...');
        setTimeout(connectWebSocket, 5000);
      }
    };
  };

  const pollForEvents = async () => {
    if (isPolling.value) return;
    isPolling.value = true;

    const poll = async () => {
      try {
        await eventStore.fetchEvents();
        // 确保在轮询获取事件后更新过滤后的事件列表
        eventStore.$patch({ events: [...eventStore.events] });
      } catch (error) {
        console.error('轮询错误:', error);
      }

      if (isPolling.value) {
        setTimeout(poll, 5000); // 每5秒轮询一次
      }
    };

    poll();
  };

  const disconnectWebSocket = () => {
    if (ws.value) {
      ws.value.close();
    }
    isPolling.value = false;
  };

  return {
    connectWebSocket,
    disconnectWebSocket
  };
}