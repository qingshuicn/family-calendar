// 文件路径: src/websocket.js
const WebSocket = require('ws');

function setupWebSocket(wss, db) {
  wss.on('connection', async (ws, req) => {
    console.log(`新的 WebSocket 连接，来自: ${req.socket.remoteAddress}`);

    try {
      const events = await db.collection('events').find().toArray();
      console.log(`向新连接的客户端发送 ${events.length} 个初始事件`);
      ws.send(JSON.stringify({ type: 'initial', events: events }));
    } catch (error) {
      console.error('获取初始事件时出错:', error);
    }

    ws.on('message', (message) => {
      console.log('收到消息:', message.toString());
      try {
        const data = JSON.parse(message);
        if (data.type === 'newEvent') {
          broadcastEvent(wss, data, ws);
        }
      } catch (error) {
        console.error('处理消息时出错:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket 连接错误:', error);
    });

    ws.on('close', (code, reason) => {
      console.log(`WebSocket 连接关闭，代码: ${code}, 原因: ${reason}`);
    });
  });

  wss.on('error', (error) => {
    console.error('WebSocket 服务器错误:', error);
  });
}

function broadcastEvent(wss, data, excludeWs = null) {
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { setupWebSocket, broadcastEvent };