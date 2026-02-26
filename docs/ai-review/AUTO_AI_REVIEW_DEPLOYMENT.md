# 自动AI审核系统部署指南

## 系统概述

AI创客工具导航网站的自动AI审核系统包含以下组件：

1. **前端管理界面** - Admin页面中的审核日志管理
2. **自动AI审核服务** - 定时执行AI审核的核心服务
3. **通知系统** - 邮件和webhook通知
4. **数据库表** - 存储审核日志和结果

## 部署步骤

### 1. 数据库迁移

首先需要创建审核日志相关的数据库表：

```sql
-- 在Supabase控制台的SQL编辑器中执行
-- 文件路径: database/migrations/create_ai_review_logs.sql

-- 审核日志表
CREATE TABLE IF NOT EXISTS ai_review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_date DATE NOT NULL,
  total_tools INTEGER NOT NULL DEFAULT 0,
  approved_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  manual_review_count INTEGER NOT NULL DEFAULT 0,
  review_results JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'executed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- 审核结果详情表
CREATE TABLE IF NOT EXISTS ai_review_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID REFERENCES ai_review_logs(id) ON DELETE CASCADE,
  tool_submission_id UUID REFERENCES tool_submissions(id) ON DELETE CASCADE,
  ai_result JSONB NOT NULL,
  final_decision VARCHAR(20) CHECK (final_decision IN ('approve', 'reject', 'manual_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. 环境变量配置

在项目根目录的 `.env` 文件中添加以下配置：

```env
# DeepSeek API配置
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com

# 通知配置
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
VITE_EMAIL_RECIPIENTS=admin@example.com,manager@example.com
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASS=your-app-password

VITE_WEBHOOK_NOTIFICATIONS_ENABLED=true
VITE_WEBHOOK_URL=https://your-webhook-url.com/notify
```

### 3. 定时任务部署

#### 方案一：使用Node.js定时任务（推荐）

1. 进入scheduler目录：
```bash
cd scheduler
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
# 复制主项目的.env文件到scheduler目录
cp ../.env .env
```

4. 启动定时任务：
```bash
npm start
```

5. 使用PM2管理进程（推荐）：
```bash
# 安装PM2
npm install -g pm2

# 启动定时任务
pm2 start scheduler.js --name "ai-review-scheduler"

# 查看状态
pm2 status

# 查看日志
pm2 logs ai-review-scheduler

# 设置开机自启
pm2 startup
pm2 save
```

#### 方案二：使用系统Cron

1. 创建cron脚本：
```bash
# 创建脚本文件
sudo nano /usr/local/bin/ai-review-cron.sh
```

2. 脚本内容：
```bash
#!/bin/bash
cd /path/to/your/project/scheduler
/usr/bin/node scheduler.js >> /var/log/ai-review.log 2>&1
```

3. 设置执行权限：
```bash
sudo chmod +x /usr/local/bin/ai-review-cron.sh
```

4. 添加cron任务：
```bash
sudo crontab -e
```

5. 添加以下行（每天上午9点执行）：
```cron
0 9 * * * /usr/local/bin/ai-review-cron.sh
```

### 4. 邮件服务配置

#### Gmail配置示例

1. 启用两步验证
2. 生成应用专用密码
3. 配置环境变量：
```env
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASS=your-app-password
```

#### 其他邮件服务商

**QQ邮箱：**
```env
VITE_SMTP_HOST=smtp.qq.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=your-qq@qq.com
VITE_SMTP_PASS=your-authorization-code
```

**163邮箱：**
```env
VITE_SMTP_HOST=smtp.163.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=your-email@163.com
VITE_SMTP_PASS=your-authorization-code
```

### 5. Webhook配置

配置接收webhook通知的服务端点：

```javascript
// 示例：Express.js接收webhook
app.post('/notify', (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'ai_review_completed') {
    // 处理审核完成通知
    console.log('AI审核完成:', data);
    
    // 可以发送到Slack、钉钉、企业微信等
    sendToSlack(`AI审核完成：${data.total_tools}个工具待确认`);
  }
  
  if (type === 'ai_review_executed') {
    // 处理审核执行完成通知
    console.log('审核结果已执行:', data);
  }
  
  res.status(200).send('OK');
});
```

### 6. 监控和日志

#### 查看定时任务日志

```bash
# PM2日志
pm2 logs ai-review-scheduler

# 系统日志
tail -f /var/log/ai-review.log
```

#### 监控指标

- 定时任务是否正常运行
- DeepSeek API调用次数和成功率
- 审核日志创建和执行状态
- 通知发送成功率

### 7. 故障排除

#### 常见问题

1. **定时任务不执行**
   - 检查PM2进程状态：`pm2 status`
   - 检查环境变量配置
   - 查看错误日志：`pm2 logs`

2. **DeepSeek API调用失败**
   - 检查API密钥是否正确
   - 检查网络连接
   - 查看API配额是否用完

3. **邮件发送失败**
   - 检查SMTP配置
   - 确认邮箱授权码正确
   - 检查防火墙设置

4. **数据库连接失败**
   - 检查Supabase URL和密钥
   - 确认数据库表已创建
   - 检查网络连接

#### 调试模式

启用调试模式获取详细日志：

```bash
# 设置调试环境变量
export DEBUG=ai-review:*

# 运行调试版本
npm run dev
```

### 8. 安全考虑

1. **API密钥安全**
   - 使用环境变量存储敏感信息
   - 定期轮换API密钥
   - 限制API访问权限

2. **数据库安全**
   - 使用Row Level Security
   - 限制数据库用户权限
   - 定期备份数据

3. **网络安全**
   - 使用HTTPS连接
   - 配置防火墙规则
   - 监控异常访问

### 9. 性能优化

1. **API调用优化**
   - 设置合理的请求间隔
   - 实现重试机制
   - 缓存重复请求

2. **数据库优化**
   - 添加适当索引
   - 定期清理旧日志
   - 优化查询语句

3. **通知优化**
   - 批量发送邮件
   - 异步处理通知
   - 失败重试机制

## 维护指南

### 日常维护

1. **每日检查**
   - 定时任务运行状态
   - 审核日志处理情况
   - 通知发送状态

2. **每周维护**
   - 清理旧的审核日志
   - 检查API使用量
   - 更新系统补丁

3. **每月维护**
   - 分析审核效果
   - 优化AI提示词
   - 备份重要数据

### 升级指南

1. **代码更新**
   ```bash
   git pull origin main
   npm install
   npm run build
   pm2 restart ai-review-scheduler
   ```

2. **数据库迁移**
   - 备份现有数据
   - 执行新的迁移脚本
   - 验证数据完整性

---

如有问题，请参考技术文档或联系开发团队。
