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

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('新的WebSocket连接');
  
  // 发送现有事件到新连接的客户端
  ws.send(JSON.stringify({ type: 'initial', events: events }));

  ws.on('close', () => {
    console.log('WebSocket连接关闭');
  });
});

// 广播事件到所有连接的客户端
function broadcastEvent(event) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'newEvent', event: event }));
    }
  });
}

app.post('/api/events', (req, res) => {
  const newEvent = req.body;
  newEvent.id = events.length + 1;
  events.push(newEvent);

  // 广播新事件
  broadcastEvent(newEvent);

  res.status(201).json(newEvent);
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});