const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let events = [];

// WebSocket 错误处理
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log(`新的 WebSocket 连接，来自: ${req.socket.remoteAddress}`);
  console.log('请求头:', req.headers);

  // 发送现有事件到新连接的客户端
  ws.send(JSON.stringify({ type: 'initial', events: events }));

  ws.on('message', (message) => {
    console.log('收到消息:', message.toString());
    try {
      const data = JSON.parse(message);
      if (data.type === 'newEvent') {
        // 广播新事件给所有连接的客户端
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
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

// 辅助函数：验证事件数据
function validateEventData(eventData) {
  const requiredFields = ['title', 'description', 'startDate', 'endDate', 'role'];
  for (let field of requiredFields) {
    if (!eventData[field]) {
      return `缺少必需字段: ${field}`;
    }
  }
  
  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if (!dateRegex.test(eventData.startDate) || !dateRegex.test(eventData.endDate)) {
    return '日期格式不正确，应为 YYYY-MM-DDTHH:mm:ss';
  }
  
  return null; // 如果没有错误，返回 null
}

app.post('/api/events', (req, res) => {
  console.log('收到 POST 请求 /api/events:', req.body);
  const newEvent = req.body;
  
  // 验证事件数据
  const validationError = validateEventData(newEvent);
  if (validationError) {
    console.error('事件验证失败:', validationError);
    return res.status(400).json({ error: validationError });
  }
  
  // 添加唯一 ID
  newEvent.id = events.length + 1;
  
  // 将新事件添加到数组中
  events.push(newEvent);
  
  // 广播新事件给所有 WebSocket 客户端
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'newEvent', event: newEvent }));
    }
  });
  
  console.log('新事件已创建:', newEvent);
  // 返回新创建的事件
  res.status(201).json(newEvent);
});

app.get('/api/events', (req, res) => {
  console.log('收到 GET 请求 /api/events');
  res.json(events);
});

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log(`WebSocket 服务器准备就绪`);
});