const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'familyScheduler';

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('已成功连接到 MongoDB');
    const db = client.db(dbName);
    
    // 初始化角色集合
    const roles = await db.collection('roles').find().toArray();
    if (roles.length === 0) {
      await db.collection('roles').insertMany([
        { name: '全家', isDefault: true },
        { name: '爸爸', isDefault: true },
        { name: '妈妈', isDefault: true },
        { name: '弟弟', isDefault: true },
        { name: '姐姐', isDefault: true },
        { name: '阿姨', isDefault: true },
      ]);
      console.log("默认角色已添加");
    }
    
    return db;
  } catch (error) {
    console.error('MongoDB 连接错误:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };