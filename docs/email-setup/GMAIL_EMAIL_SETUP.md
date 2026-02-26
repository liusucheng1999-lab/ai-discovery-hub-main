# Gmail邮件通知配置指南

## 配置步骤

### 1. 启用Gmail两步验证

1. 登录你的Gmail账户：liusucheng1999@gmail.com
2. 进入Google账户设置：https://myaccount.google.com/
3. 选择"安全性" → "两步验证"
4. 点击"开始设置"并按照提示完成两步验证

### 2. 生成应用专用密码

由于Gmail不再支持普通密码登录，需要生成应用专用密码：

1. 在Google账户的"安全性"页面
2. 找到"应用专用密码"选项
3. 点击"生成"
4. 选择"邮件"和"其他（自定义名称）"
5. 输入应用名称，如"AI审核系统"
6. 点击"生成"
7. 复制生成的16位密码（格式：xxxx xxxx xxxx xxxx）

### 3. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```env
# 通知配置
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
VITE_EMAIL_RECIPIENTS=liusucheng1999@gmail.com
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=liusucheng1999@gmail.com
VITE_SMTP_PASS=这里填入刚才生成的16位应用专用密码
```

**重要：**
- `VITE_SMTP_PASS` 填写的是刚才生成的16位应用专用密码，不是你的Gmail登录密码
- 密码格式包含空格，请完整复制，如：`abcd efgh ijkl mnop`

### 4. 测试邮件配置

配置完成后，可以通过以下方式测试：

#### 方法一：在前端测试
1. 启动项目：`npm run dev`
2. 访问Admin页面
3. 点击"开始自动AI审核"按钮
4. 检查是否收到邮件通知

#### 方法二：使用Node.js脚本测试
```bash
cd scheduler
npm install
node -e "
const { notificationService } = require('../src/lib/notification-service.ts');
notificationService.testNotifications().then(result => {
  console.log('测试结果:', result);
});
"
```

### 5. 常见问题解决

#### 问题1：认证失败
**错误信息：** `535-5.7.8 Username and Password not accepted`
**解决方案：**
- 确认已启用两步验证
- 确认使用的是应用专用密码，不是登录密码
- 检查邮箱地址是否正确

#### 问题2：连接超时
**错误信息：** `connect ETIMEDOUT`
**解决方案：**
- 检查网络连接
- 确认SMTP端口（587）未被防火墙阻止
- 尝试更换网络环境

#### 问题3：发送失败
**错误信息：** `550 Message rejected`
**解决方案：**
- 检查邮件内容是否包含敏感词汇
- 确认收件人地址正确
- 检查发送频率是否过高

### 6. 安全建议

1. **保护应用专用密码**
   - 不要在代码中硬编码密码
   - 使用环境变量存储
   - 定期更换密码

2. **监控邮件发送**
   - 设置发送频率限制
   - 监控异常发送行为
   - 定期检查发送日志

3. **备份配置**
   - 保存应用专用密码的备份
   - 记录配置步骤
   - 准备应急方案

### 7. 其他邮件服务配置

如果Gmail配置有问题，也可以考虑其他邮件服务：

#### QQ邮箱
```env
VITE_SMTP_HOST=smtp.qq.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=your-qq@qq.com
VITE_SMTP_PASS=your-qq-authorization-code
```

#### 163邮箱
```env
VITE_SMTP_HOST=smtp.163.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=your-email@163.com
VITE_SMTP_PASS=your-163-authorization-code
```

#### Outlook邮箱
```env
VITE_SMTP_HOST=smtp-mail.outlook.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=liusucheng1999@outlook.com
VITE_SMTP_PASS=your-outlook-password
```

### 8. 邮件模板预览

配置成功后，你将收到如下格式的邮件：

**主题：** AI审核完成 - 5个工具待确认

**内容预览：**
```
🤖 AI审核完成通知
2024年2月12日 的AI审核已完成

📊 审核统计:
总工具数: 5
建议通过: 3 (60.0%)
建议拒绝: 1 (20.0%)
需人工审核: 1 (20.0%)
发现重复: 0 (0.0%)
高质量工具: 2 (40.0%)

⭐ 推荐通过的优质工具:
1. ChatGPT (成熟度:9/10, 有趣度:9/10)
2. Claude AI (成熟度:8/10, 有趣度:8/10)

📝 请确认审核结果
请登录管理后台查看详细审核结果并确认执行
```

---

配置完成后，系统将在每次AI审核完成后自动发送通知到你的邮箱liusucheng1999@gmail.com。
