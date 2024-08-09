// utils.js

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
    
    // 验证 recurrenceType（如果提供）
    if (eventData.recurrenceType && !['daily', 'weekly', 'monthly'].includes(eventData.recurrenceType)) {
      return '无效的重复类型。允许的值为：daily, weekly, monthly';
    }
    
    return null; // 如果没有错误，返回 null
  }
  
  function getCurrentWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
  }
  
  module.exports = { validateEventData, getCurrentWeek };