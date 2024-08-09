const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const { connectToDatabase } = require('./db');
const { setupWebSocket } = require('./websocket');
const { setupRoutes } = require('./routes');
const { validateEventData, getCurrentWeek } = require('./utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

app.use(cors());
app.use(bodyParser.json());

async function scheduleRecurringEvents(db, wss) {
  console.log('开始调度重复事件');
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  try {
    const recurringEvents = await db.collection('events').find({
      recurrenceType: { $exists: true, $ne: null }
    }).toArray();

    for (let event of recurringEvents) {
      const eventDate = new Date(event.startDate);
      if (eventDate >= todayStart && eventDate < todayEnd) {
        // 创建今天的事件实例
        const newEvent = {
          ...event,
          _id: new ObjectId(),
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), eventDate.getHours(), eventDate.getMinutes()),
          endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), new Date(event.endDate).getHours(), new Date(event.endDate).getMinutes()),
          isRecurringInstance: true
        };
        delete newEvent.recurrenceType;

        await db.collection('events').insertOne(newEvent);
        console.log(`已创建重复事件实例: ${newEvent.title}`);

        // 广播新事件给所有连接的 WebSocket 客户端
        const eventMessage = JSON.stringify({ type: 'newEvent', event: newEvent });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(eventMessage);
          }
        });
      }
    }
  } catch (error) {
    console.error('处理重复事件时出错:', error);
  }
}

connectToDatabase()
  .then((db) => {
    setupWebSocket(wss, db);
    setupRoutes(app, db, wss);
    
    cron.schedule('0 0 * * *', () => {
      scheduleRecurringEvents(db, wss);
    });

    server.listen(port, () => {
      console.log(`服务器运行在 http://localhost:${port}`);
      console.log(`WebSocket 服务器准备就绪`);
    });
  })
  .catch(error => console.error('服务器启动错误:', error));