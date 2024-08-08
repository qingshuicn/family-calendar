const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'familyScheduler';

app.use(cors());
app.use(bodyParser.json());

let db;

// 连接到 MongoDB
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('已成功连接到 MongoDB');
    db = client.db(dbName);
    db.collection('roles').findOne({}, (err, result) => {
      if (err) throw err;
      if (!result) {
        // 如果集合为空，添加默认角色
        db.collection('roles').insertMany([
          { name: '全家', isDefault: true },
          { name: '爸爸', isDefault: true },
          { name: '妈妈', isDefault: true },
          { name: '弟弟', isDefault: true },
          { name: '姐姐', isDefault: true },
          { name: '阿姨', isDefault: true },
        ], (err, res) => {
          if (err) throw err;
          console.log("默认角色已添加");
        });
      }
    });
  })
  .catch(error => console.error('MongoDB 连接错误:', error));

// 获取当前周数
function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
}

// WebSocket 错误处理
wss.on('error', (error) => {
  console.error('WebSocket 服务器错误:', error);
});

// WebSocket 连接处理
wss.on('connection', async (ws, req) => {
  console.log(`新的 WebSocket 连接，来自: ${req.socket.remoteAddress}`);


  try {
    // 发送现有事件到新连接的客户端
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
// 获取所有角色
app.get('/api/roles', async (req, res) => {
  console.log('收到 GET 请求 /api/roles');
  try {
    const roles = await db.collection('roles').find().toArray();
    res.json(roles);
  } catch (error) {
    console.error('获取角色时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 添加新角色
app.post('/api/roles', async (req, res) => {
  console.log('收到 POST 请求 /api/roles:', req.body);
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: '缺少必需字段: name' });
  }
  
  try {
    const newRole = {
      name: name,
      isDefault: false
    };
    
    const result = await db.collection('roles').insertOne(newRole);
    newRole._id = result.insertedId;
    
    res.status(201).json(newRole);
  } catch (error) {
    console.error('创建新角色时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新现有角色
app.put('/api/roles/:id', async (req, res) => {
  console.log(`收到 PUT 请求 /api/roles/${req.params.id}`);
  const { id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: '缺少必需字段: name' });
  }
  
  try {
    const result = await db.collection('roles').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: name } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '未找到角色' });
    }
    
    res.json({ message: '角色已更新', id: id, name: name });
  } catch (error) {
    console.error('更新角色时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 删除角色
app.delete('/api/roles/:id', async (req, res) => {
  console.log(`收到 DELETE 请求 /api/roles/${req.params.id}`);
  const { id } = req.params;
  
  try {
    const result = await db.collection('roles').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: '未找到角色' });
    }
    
    res.json({ message: '角色已删除', id: id });
  } catch (error) {
    console.error('删除角色时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取每周星星数
app.get('/api/weekly-stars', async (req, res) => {
  console.log('收到 GET 请求 /api/weekly-stars');
  try {
    const currentWeek = getCurrentWeek();
    const stars = await db.collection('stars').find().toArray();
    const result = {};
    
    for (let star of stars) {
      if (star.lastUpdateWeek !== currentWeek) {
        await db.collection('stars').updateOne(
          { _id: star._id },
          { $set: { stars: 0, lastUpdateWeek: currentWeek } }
        );
        result[star.role] = 0;
      } else {
        result[star.role] = star.stars;
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('获取每周星星数据时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.get('/api/events', async (req, res) => {
  console.log('收到 GET 请求 /api/events');
  try {
    const events = await db.collection('events').find().toArray();
    console.log(`获取到 ${events.length} 个事件`);
    res.json(events);
  } catch (error) {
    console.error('获取事件时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, description, startDate, endDate, role } = req.body;
  console.log('收到创建事件请求:', { title, description, startDate, endDate, role });

  if (!title || !description || !startDate || !endDate || !role) {
    return res.status(400).json({ error: '缺少必需字段' });
  }

  try {
    let roleDocument;

    if (ObjectId.isValid(role)) {
      roleDocument = await db.collection('roles').findOne({ _id: new ObjectId(role) });
    } else {
      roleDocument = await db.collection('roles').findOne({ name: role });
    }

    if (!roleDocument) {
      console.log('未找到对应的角色:', role);
      return res.status(404).json({ error: '未找到对应的角色' });
    }

    const newEvent = {
      title,
      description,
      startDate,
      endDate,
      role: roleDocument.name
    };

    const result = await db.collection('events').insertOne(newEvent);
    const insertedEvent = { ...newEvent, _id: result.insertedId };
    console.log('新事件已创建:', insertedEvent);

    // 广播新事件给所有连接的 WebSocket 客户端
    const eventMessage = JSON.stringify({ type: 'newEvent', event: insertedEvent });
    console.log('准备广播新事件:', eventMessage);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(eventMessage);
        console.log('已向客户端广播新事件');
      }
    });

    res.status(201).json(insertedEvent);
  } catch (error) {
    console.error('创建事件时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, description, startDate, endDate, role } = req.body;
  console.log('收到创建事件请求:', { title, description, startDate, endDate, role });

  try {
    let roleDocument;

    // 直接使用角色名称
    roleDocument = await db.collection('roles').findOne({ name: role });

    if (!roleDocument) {
      console.log('未找到对应的角色:', role);
      return res.status(404).json({ error: '未找到对应的角色' });
    }

    const newEvent = {
      title,
      description,
      startDate,
      endDate,
      role: roleDocument.name
    };

    const result = await db.collection('events').insertOne(newEvent);
    const insertedEvent = { ...newEvent, _id: result.insertedId };
    console.log('新事件已创建:', insertedEvent);

    // 广播新事件给所有连接的 WebSocket 客户端
    const eventMessage = JSON.stringify({ type: 'newEvent', event: insertedEvent });
    console.log('准备广播新事件:', eventMessage);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(eventMessage);
        console.log('已向客户端广播新事件');
      }
    });

    res.status(201).json(insertedEvent);
  } catch (error) {
    console.error('创建事件时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`收到删除事件请求，事件ID: ${id}`);

  try {
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.log(`未找到ID为 ${id} 的事件`);
      return res.status(404).json({ error: '未找到事件' });
    }

    console.log(`成功删除事件，ID: ${id}`);

    // 广播删除事件消息给所有连接的 WebSocket 客户端
    const deleteMessage = JSON.stringify({ type: 'deleteEvent', eventId: id });
    console.log('准备广播删除事件消息:', deleteMessage);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(deleteMessage);
        console.log('已向客户端广播删除事件消息');
      }
    });

    res.status(200).json({ message: '事件已成功删除' });
  } catch (error) {
    console.error('删除事件时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新事件完成状态的路由
app.put('/api/events/:id/complete', async (req, res) => {
  console.log(`收到 PUT 请求 /api/events/${req.params.id}/complete`);
  const { id } = req.params;
  const { completed } = req.body;

  try {
    if (!db) {
      throw new Error('数据库连接未初始化');
    }

    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({ error: '未找到事件' });
    }

    // 更新事件状态
    const updateResult = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: completed } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('事件更新失败');
    }

    let updatedStars = null;
    if (completed) {
      // 如果事件被标记为完成，更新星星数
      const currentWeek = getCurrentWeek();
      const updateStarResult = await db.collection('stars').findOneAndUpdate(
        { role: event.role },
        { 
          $inc: { stars: 1 },
          $set: { lastUpdateWeek: currentWeek }
        },
        { upsert: true, returnDocument: 'after' }
      );
      
      // 添加检查以确保 updateStarResult 和 updateStarResult.value 存在
      if (updateStarResult && updateStarResult.value) {
        updatedStars = updateStarResult.value.stars;
      } else {
        console.warn('无法获取更新后的星星数');
      }
    }

    // 获取更新后的事件
    const updatedEvent = await db.collection('events').findOne({ _id: new ObjectId(id) });

    res.json({ 
      message: '事件状态已更新', 
      event: updatedEvent,
      updatedStars: updatedStars
    });
  } catch (error) {
    console.error('更新事件完成状态时出错:', error);
    res.status(500).json({ error: '服务器内部错误', details: error.message });
  }
});
// 仅在开发环境中启用此路由  这是删除所有数据库事件
app.post('/api/events/clear', async (req, res) => {
  try {
    // 使用一个特定的请求头作为简单的安全措施
    if (req.headers['x-clear-events-secret'] !== 'NAN2005shan') {
      return res.status(403).json({ error: '未授权的操作' });
    }

    const result = await db.collection('events').deleteMany({});
    console.log(`已删除 ${result.deletedCount} 条事件记录`);
    res.json({ message: `成功清空事件集合，删除了 ${result.deletedCount} 条记录` });
  } catch (error) {
    console.error('清空事件集合时出错:', error);
    res.status(500).json({ error: '清空事件集合时发生服务器错误' });
  }
});

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log(`WebSocket 服务器准备就绪`);
});