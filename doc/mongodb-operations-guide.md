# MongoDB 常用操作指南 - 家庭日程项目

[前面的内容保持不变，在文档末尾添加新的章节]

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

记住，在处理生产环境时，始终遵循最佳安全实践。定期更新 MongoDB 到最新的稳定版本，使用强密码，并限制数据库的网络访问。

这些命令和操作应该能够帮助你管理和维护你的 MongoDB 数据库。如果你需要任何特定命令的更多细节，或者有其他特殊的管理需求，请随时告诉我。
