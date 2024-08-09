// 文件路径: src/routes.js
const { ObjectId } = require('mongodb');
const { validateEventData, getCurrentWeek } = require('./utils');
const { broadcastEvent } = require('./websocket');

function setupRoutes(app, db, wss) {
  // 角色相关路由
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

  app.post('/api/roles', async (req, res) => {
    console.log('收到 POST 请求 /api/roles:', req.body);
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: '缺少必需字段: name' });
    }
    
    try {
      const newRole = { name, isDefault: false };
      const result = await db.collection('roles').insertOne(newRole);
      newRole._id = result.insertedId;
      res.status(201).json(newRole);
    } catch (error) {
      console.error('创建新角色时出错:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  });

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
        { $set: { name } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: '未找到角色' });
      }
      
      res.json({ message: '角色已更新', id, name });
    } catch (error) {
      console.error('更新角色时出错:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  });

  app.delete('/api/roles/:id', async (req, res) => {
    console.log(`收到 DELETE 请求 /api/roles/${req.params.id}`);
    const { id } = req.params;
    
    try {
      const result = await db.collection('roles').deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: '未找到角色' });
      }
      
      res.json({ message: '角色已删除', id });
    } catch (error) {
      console.error('删除角色时出错:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  });


// 文件路径: src/routes.js（续）

  // 事件相关路由
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
    const { title, description, startDate, endDate, role, recurrenceType } = req.body;
    console.log('收到创建事件请求:', { title, description, startDate, endDate, role, recurrenceType });

    const validationError = validateEventData({ title, description, startDate, endDate, role, recurrenceType });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      let roleDocument = await db.collection('roles').findOne({ name: role });

      if (!roleDocument) {
        console.log('未找到对应的角色:', role);
        return res.status(404).json({ error: '未找到对应的角色' });
      }

      const newEvent = {
        title,
        description,
        startDate,
        endDate,
        role: roleDocument.name,
        recurrenceType
      };

      const result = await db.collection('events').insertOne(newEvent);
      const insertedEvent = { ...newEvent, _id: result.insertedId };
      console.log('新事件已创建:', insertedEvent);

      // 广播新事件给所有连接的 WebSocket 客户端
      broadcastEvent(wss, { type: 'newEvent', event: insertedEvent });

      res.status(201).json(insertedEvent);
    } catch (error) {
      console.error('创建事件时出错:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  });

  app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate, role, recurrenceType } = req.body;
    console.log(`收到更新事件请求，事件ID: ${id}`, { title, description, startDate, endDate, role, recurrenceType });

    const validationError = validateEventData({ title, description, startDate, endDate, role, recurrenceType });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      let roleDocument = await db.collection('roles').findOne({ name: role });

      if (!roleDocument) {
        console.log('未找到对应的角色:', role);
        return res.status(404).json({ error: '未找到对应的角色' });
      }

      const updatedEvent = {
        title,
        description,
        startDate,
        endDate,
        role: roleDocument.name,
        recurrenceType
      };

      const result = await db.collection('events').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedEvent }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: '未找到事件' });
      }

      const finalUpdatedEvent = { ...updatedEvent, _id: id };
      console.log('事件已更新:', finalUpdatedEvent);

      // 广播更新的事件给所有连接的 WebSocket 客户端
      broadcastEvent(wss, { type: 'updateEvent', event: finalUpdatedEvent });

      res.json(finalUpdatedEvent);
    } catch (error) {
      console.error('更新事件时出错:', error);
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
      broadcastEvent(wss, { type: 'deleteEvent', eventId: id });

      res.status(200).json({ message: '事件已成功删除' });
    } catch (error) {
      console.error('删除事件时出错:', error);
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

  // 更新事件完成状态
  app.put('/api/events/:id/complete', async (req, res) => {
    console.log(`收到 PUT 请求 /api/events/${req.params.id}/complete`);
    const { id } = req.params;
    const { completed } = req.body;

    try {
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
        
        if (updateStarResult && updateStarResult.value) {
          updatedStars = updateStarResult.value.stars;
        } else {
          console.warn('无法获取更新后的星星数');
        }
      }

      // 获取更新后的事件
      const updatedEvent = await db.collection('events').findOne({ _id: new ObjectId(id) });

      // 广播事件状态更新
      broadcastEvent(wss, { type: 'updateEvent', event: updatedEvent });

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

  // 仅在开发环境中启用此路由，用于删除所有数据库事件
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/events/clear', async (req, res) => {
      try {
        // 使用一个特定的请求头作为简单的安全措施
        if (req.headers['x-clear-events-secret'] !== 'NAN2005shan') {
          return res.status(403).json({ error: '未授权的操作' });
        }

        const result = await db.collection('events').deleteMany({});
        console.log(`已删除 ${result.deletedCount} 条事件记录`);
        res.json({ message: `成功清空事件集合，删除了 ${result.deletedCount} 条记录` });

        // 广播清除事件消息
        broadcastEvent(wss, { type: 'clearEvents' });
      } catch (error) {
        console.error('清空事件集合时出错:', error);
        res.status(500).json({ error: '清空事件集合时发生服务器错误' });
      }
    });
  }
}

module.exports = { setupRoutes };