# 现代邮件服务配置指南

## 🚀 推荐方案

由于Google逐步淘汰应用专用密码，我们推荐使用以下现代邮件服务：

### 方案一：SendGrid（推荐企业用户）

**优势：**
- Google官方推荐
- 每月100封免费邮件
- 高送达率
- 详细的发送统计

**配置步骤：**

1. **注册SendGrid账户**
   - 访问：https://sendgrid.com/
   - 选择免费计划（Free Plan）
   - 完成邮箱验证

2. **创建发件人验证**
   - Dashboard → Settings → Sender Authentication
   - 点击"Verify a Single Sender"
   - 填写你的信息：
     ```
     From Email: noreply@your-domain.com
     From Name: AI创客工具导航
     Reply To: liusucheng1999@gmail.com
     ```
   - 完成域名验证（需要添加DNS记录）

3. **获取API密钥**
   - Dashboard → Settings → API Keys
   - 点击"Create API Key"
   - 选择"Restricted Access"
   - 勾选"Mail Send"权限
   - 复制生成的API密钥

4. **配置环境变量**
   ```env
   VITE_EMAIL_SERVICE=sendgrid
   VITE_SENDGRID_API_KEY=SG.xxxxx.xxxxx.xxxxx
   VITE_EMAIL_RECIPIENTS=liusucheng1999@gmail.com
   ```

### 方案二：Resend（推荐个人用户）

**优势：**
- 每月3000封免费邮件
- 配置简单
- 现代化界面
- 支持React邮件模板

**配置步骤：**

1. **注册Resend账户**
   - 访问：https://resend.com/
   - 使用GitHub或Google账户注册
   - 免费计划包含3000封邮件/月

2. **验证域名**
   - Dashboard → Domains
   - 点击"Add Domain"
   - 输入你的域名（或使用Resend提供的域名）
   - 添加DNS记录验证

3. **获取API密钥**
   - Dashboard → API Keys
   - 点击"Create API Key"
   - 复制生成的密钥

4. **配置环境变量**
   ```env
   VITE_EMAIL_SERVICE=resend
   VITE_RESEND_API_KEY=re_xxxxxxxxxxxx
   VITE_EMAIL_RECIPIENTS=liusucheng1999@gmail.com
   ```

### 方案三：使用Gmail + OAuth2（技术方案）

如果你坚持使用Gmail，可以设置OAuth2.0：

**优势：**
- 官方推荐的安全方式
- 无需应用专用密码
- 支持权限精细控制

**缺点：**
- 配置复杂
- 需要后端支持
- 需要定期刷新token

## 🛠️ 快速配置（推荐Resend）

### 第一步：注册Resend

1. 访问 https://resend.com/
2. 点击"Sign up"
3. 选择"Sign up with Google"
4. 使用 `liusucheng1999@gmail.com` 登录

### 第二步：获取API密钥

1. 登录后进入Dashboard
2. 左侧菜单点击"API Keys"
3. 点击"Create API Key"
4. 输入名称：`AI审核系统`
5. 复制生成的密钥（格式：`re_xxxxxxxxxxxx`）

### 第三步：配置环境变量

在项目根目录的 `.env` 文件中添加：

```env
# DeepSeek配置
VITE_DEEPSEEK_API_KEY=sk-7d4193f17b76468a874ce1cce218dfa4
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com

# Supabase配置
VITE_SUPABASE_URL=https://enzduxajblrfbbdktieo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_qsN5GVEkSWOQ3_E7bHtTaA_Y_ZM0Yo4

# 邮件通知配置
VITE_EMAIL_SERVICE=resend
VITE_RESEND_API_KEY=re_这里填入你的API密钥
VITE_EMAIL_RECIPIENTS=liusucheng1999@gmail.com
```

### 第四步：测试配置

1. **启动项目**
   ```bash
   npm run dev
   ```

2. **测试邮件**
   - 访问Admin页面
   - 点击"开始自动AI审核"
   - 检查邮箱是否收到测试邮件

## 📧 邮件模板预览

配置完成后，你将收到精美的HTML邮件：

- 🎨 现代化设计，支持响应式布局
- 📊 可视化的统计数据
- 🔗 一键操作按钮
- 📱 移动端友好显示

## 🔧 故障排除

### SendGrid常见问题

**问题：** Domain not verified
**解决：** 需要验证发件人域名，按照SendGrid指引添加DNS记录

**问题：** API key invalid
**解决：** 检查API密钥是否正确，确保有Mail Send权限

### Resend常见问题

**问题：** Domain not verified
**解决：** 可以先使用Resend的默认域名 `@resend.dev` 进行测试

**问题：** Rate limit exceeded
**解决：** 免费计划每分钟100封邮件，如需更多请升级

### 通用问题

**问题：** 邮件未收到
**解决：**
1. 检查垃圾邮件文件夹
2. 确认收件人邮箱正确
3. 查看控制台错误日志

## 📊 服务对比

| 特性 | SendGrid | Resend | Gmail SMTP |
|------|----------|--------|------------|
| 免费额度 | 100封/月 | 3000封/月 | 有限制 |
| 配置难度 | 中等 | 简单 | 复杂 |
| 安全性 | 高 | 高 | 中等 |
| 统计功能 | 详细 | 基础 | 无 |
| 推荐度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

## 🎯 推荐配置

对于你的使用场景，我推荐：

**个人开发者：** 使用Resend
- 免费额度充足（3000封/月）
- 配置最简单
- 现代化界面

**企业用户：** 使用SendGrid
- Google官方推荐
- 企业级功能
- 详细统计分析

## 🚀 下一步

1. 选择一个邮件服务（推荐Resend）
2. 完成注册和API密钥获取
3. 配置环境变量
4. 测试邮件发送
5. 启动自动审核系统

配置完成后，系统就能自动发送美观的审核通知邮件了！

需要我帮你配置具体的邮件服务吗？
