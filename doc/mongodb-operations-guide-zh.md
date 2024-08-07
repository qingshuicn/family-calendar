# MongoDB 常用操作指南 - 家庭日程项目

## 1. 连接到数据库

```javascript
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'familyScheduler';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('已成功连接到 MongoDB');
    const db = client.db(dbName);
    // 在这里执行数据库操作
  })
  .catch(error => console.error('MongoDB 连接错误:', error));
```

## 2. 创建事件

```javascript
const event = {
  title: "家庭聚餐",
  description: "在家里吃晚餐",
  startDate: new Date("2024-08-10T18:00:00"),
  endDate: new Date("2024-08-10T20:00:00"),
  role: "all"
};

db.collection('events').insertOne(event)
  .then(result => console.log('事件已创建:', result.insertedId))
  .catch(error => console.error('创建事件时出错:', error));
```

## 3. 查询事件

### 获取所有事件

```javascript
db.collection('events').find().toArray()
  .then(events => console.log('所有事件:', events))
  .catch(error => console.error('获取事件时出错:', error));
```

### 按日期范围查询事件

```javascript
const startDate = new Date("2024-08-01");
const endDate = new Date("2024-08-31");

db.collection('events').find({
  startDate: { $gte: startDate },
  endDate: { $lte: endDate }
}).toArray()
  .then(events => console.log('8月份的事件:', events))
  .catch(error => console.error('获取事件时出错:', error));
```

### 按角色查询事件

```javascript
db.collection('events').find({ role: "dad" }).toArray()
  .then(events => console.log('爸爸的事件:', events))
  .catch(error => console.error('获取事件时出错:', error));
```

## 4. 更新事件

```javascript
const eventId = 'event_id_here'; // 替换为实际的事件 ID

db.collection('events').updateOne(
  { _id: ObjectId(eventId) },
  { $set: { title: "更新后的家庭聚餐", description: "改为外出吃晚餐" } }
)
  .then(result => console.log('事件已更新，修改数量:', result.modifiedCount))
  .catch(error => console.error('更新事件时出错:', error));
```

## 5. 删除事件

```javascript
const eventId = 'event_id_here'; // 替换为实际的事件 ID

db.collection('events').deleteOne({ _id: ObjectId(eventId) })
  .then(result => console.log('事件已删除，删除数量:', result.deletedCount))
  .catch(error => console.error('删除事件时出错:', error));
```

## 6. 创建索引

为了提高查询性能，可以在常用的查询字段上创建索引：

```javascript
db.collection('events').createIndex({ startDate: 1, endDate: 1 })
  .then(result => console.log('索引已创建:', result))
  .catch(error => console.error('创建索引时出错:', error));

db.collection('events').createIndex({ role: 1 })
  .then(result => console.log('索引已创建:', result))
  .catch(error => console.error('创建索引时出错:', error));
```

## 7. 聚合操作

### 按角色统计事件数量

```javascript
db.collection('events').aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
  .toArray()
  .then(result => console.log('各角色的事件数量:', result))
  .catch(error => console.error('聚合操作出错:', error));
```

## 8. 数据库管理

### 查看集合列表

```javascript
db.listCollections().toArray()
  .then(collections => console.log('集合列表:', collections))
  .catch(error => console.error('列出集合时出错:', error));
```

### 删除集合

```javascript
db.collection('events').drop()
  .then(result => console.log('集合已删除:', result))
  .catch(error => console.error('删除集合时出错:', error));
```

## 9. MongoDB 服务管理

以下命令主要用于管理 MongoDB 服务。请注意，具体的命令可能因操作系统和安装方式而略有不同。以下示例基于使用 Homebrew 在 macOS 上安装的 MongoDB。

### 启动 MongoDB 服务

```bash
brew services start mongodb-community
```

### 停止 MongoDB 服务

```bash
brew services stop mongodb-community
```

### 重启 MongoDB 服务

```bash
brew services restart mongodb-community
```

### 查看 MongoDB 服务状态

```bash
brew services list | grep mongodb
```

### 手动启动 MongoDB（不使用 brew services）

```bash
mongod --config /opt/homebrew/etc/mongod.conf
```

### 查看 MongoDB 日志

MongoDB 的日志文件位置可能因安装方式而异。通常，你可以在配置文件中找到日志文件的位置。使用以下命令查看日志：

```bash
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

### 进入 MongoDB Shell

```bash
mongosh
```

## 10. MongoDB Shell 常用命令

在 MongoDB Shell 中，你可以执行以下操作：

### 显示所有数据库

```javascript
show dbs
```

### 切换/创建数据库

```javascript
use familyScheduler
```

### 显示当前数据库中的集合

```javascript
show collections
```

### 显示当前数据库状态

```javascript
db.stats()
```

### 退出 MongoDB Shell

```javascript
exit
```

## 11. 数据库维护

### 创建数据库备份

```bash
mongodump --db familyScheduler --out /path/to/backup/directory
```

### 恢复数据库备份

```bash
mongorestore --db familyScheduler /path/to/backup/directory/familyScheduler
```

### 修复数据库

如果数据库出现问题，可以尝试修复：

```javascript
db.repairDatabase()
```

### 压缩数据库

删除文档后，可以压缩数据库以回收空间：

```javascript
db.runCommand({ compact: 'events' })
```

## 12. 安全性

### 创建管理员用户

在 MongoDB Shell 中：

```javascript
use admin
db.createUser(
  {
    user: "adminUser",
    pwd: "securePassword",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

### 启用身份验证

编辑 MongoDB 配置文件（通常在 `/opt/homebrew/etc/mongod.conf`），添加或修改以下行：

```yaml
security:
  authorization: enabled
```

然后重启 MongoDB 服务。

### 以身份验证模式连接

```bash
mongosh --authenticationDatabase "admin" -u "adminUser" -p
```

注意：在处理生产环境时，始终遵循最佳安全实践。定期更新 MongoDB 到最新的稳定版本，使用强密码，并限制数据库的网络访问。

这些命令和操作应该能够帮助你管理和维护你的 MongoDB 数据库。如果你需要任何特定命令的更多细节，或者有其他特殊的管理需求，请随时告诉我。
