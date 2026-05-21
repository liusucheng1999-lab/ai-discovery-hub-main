# 应用托管功能 - 设置指南

这个文档说明如何设置和使用应用托管功能（gapp.so MVP）。

## 功能概述

用户可以上传 HTML/JS 应用或 ZIP 文件包，系统会自动生成展示页面，并通过 iframe 在网页上运行应用。

## 已实现的功能

### ✅ 后端基础设施
- [x] PostgreSQL 表 (`hosted_apps`, `app_files`)
- [x] Row Level Security (RLS) 策略
- [x] 应用元数据和文件版本管理

### ✅ 前端页面和组件
- [x] `/publish` - 应用发布页面（需要登录）
- [x] `/apps/:id` - 应用详情页面（显示应用 + iframe）
- [x] `/published-apps` - 应用库列表
- [x] `/my-apps` - 用户管理后台（需要登录）

### ✅ 核心功能
- [x] 文件上传（拖拽或点击）
- [x] HTML 文件上传
- [x] ZIP 文件解压和上传
- [x] 应用发布/取消发布
- [x] 应用查看和编辑
- [x] 浏览计数统计
- [x] RLS 安全性保护（用户只能访问自己的应用或已发布的应用）

## 需要手动配置的部分

### 1. 创建 Supabase Storage Bucket

进入 [Supabase Dashboard](https://app.supabase.com)，找到你的项目：

1. 点击左侧菜单的 **Storage**
2. 点击 **Create a new bucket**
3. 输入 bucket 名称：`hosted-apps`
4. 勾选 **Public bucket**（这样应用才能通过公开 URL 访问）
5. 点击 **Create bucket**

或者使用 Supabase CLI：

```bash
supabase link  # 连接到你的项目
supabase start  # 启动本地开发环境
```

### 2. 配置 Storage 权限

在 Supabase Dashboard 中，为 `hosted-apps` bucket 设置以下 RLS 策略：

**允许认证用户上传文件到自己的目录：**
```sql
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'hosted-apps' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );
```

**允许所有人读取已发布的应用：**
```sql
CREATE POLICY "Anyone can read published apps"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hosted-apps');
```

## 测试功能

### 1. 创建测试应用

创建一个简单的 `test-app.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试应用</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 500px;
      text-align: center;
    }
    h1 { color: #333; margin-bottom: 20px; }
    p { color: #666; margin-bottom: 30px; line-height: 1.6; }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s;
    }
    button:hover { background: #5568d3; }
    .counter { font-size: 24px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 欢迎来到我的应用</h1>
    <p>这是一个通过应用库发布的测试应用</p>
    <div class="counter">点击次数：<span id="count">0</span></div>
    <button onclick="increment()">点击我</button>
  </div>

  <script>
    let count = 0;
    function increment() {
      count++;
      document.getElementById('count').textContent = count;
    }
  </script>
</body>
</html>
```

### 2. 发布应用

1. 在应用中登录
2. 点击导航栏的 **发布应用**
3. 拖拽或选择 `test-app.html` 文件
4. 输入应用名称和描述
5. 点击 **发布应用**

### 3. 查看应用

1. 点击导航栏的 **应用库**，你应该看不到你的应用（因为还未发布）
2. 点击导航栏的 **我的应用**，可以看到刚上传的应用
3. 点击应用卡片上的 **查看应用**
4. 应用应该在 iframe 中显示
5. 测试应用的交互功能（点击按钮）

### 4. 发布应用

在 **我的应用** 页面，点击应用卡片下的 **发布** 按钮将其发布。

发布后，任何人都可以在 **应用库** 看到这个应用。

## 文件结构

```
src/
├── pages/
│   ├── PublishApp.tsx         # 应用发布页面
│   ├── AppDetail.tsx          # 应用详情页面（iframe）
│   ├── PublishedApps.tsx      # 应用库列表
│   └── AppManagement.tsx      # 用户管理后台
├── components/
│   ├── AppUpload.tsx          # 文件上传组件
│   └── AppCard.tsx            # 应用卡片组件
├── lib/
│   ├── appService.ts          # 应用 API 调用
│   └── fileService.ts         # ZIP 文件处理
├── types/
│   └── app.ts                 # TypeScript 类型定义
└── database/migrations/
    └── create_hosted_apps_tables.sql  # 数据库迁移
```

## API 方法

### appService 方法

```typescript
// 上传应用
appService.uploadApp({ name, description, file })

// 获取应用详情
appService.getApp(appId)

// 获取已发布的应用列表
appService.getPublishedApps(limit, offset)

// 获取用户的所有应用
appService.getUserApps()

// 更新应用信息
appService.updateApp(appId, { name, description, is_published })

// 删除应用
appService.deleteApp(appId)

// 发布/取消发布应用
appService.publishApp(appId, isPublished)

// 获取应用文件的公开 URL
appService.getAppFileUrl(filePath)

// 增加浏览计数
appService.incrementViewCount(appId)
```

## 安全性考虑

### RLS 策略
- 用户只能看到自己的应用或已发布的应用
- 用户只能编辑和删除自己的应用
- Storage 中的文件权限也受 RLS 保护

### iframe 沙箱
- 应用在 iframe 中运行，沙箱限制为：
  - `allow-scripts` - 允许 JavaScript
  - `allow-same-origin` - 允许访问同源资源
  - `allow-forms` - 允许表单提交
  - `allow-popups` - 允许弹窗

### URL 访问
- Storage 文件通过 Supabase 提供的公开 URL 访问
- URL 可在公开分享，但受存储桶权限限制

## 未来改进

- [ ] 支持更多文件格式和资源（图片、字体等）
- [ ] 应用预览截图
- [ ] 应用统计仪表板（实时浏览、使用等）
- [ ] 应用搜索和筛选
- [ ] 应用评分和评论
- [ ] 变现功能（打赏、付费应用、卖提示词）
- [ ] 应用市场 SEO 优化
- [ ] 支持自定义域名
- [ ] 应用版本管理
- [ ] 应用导出功能

## 故障排除

### 上传失败

**问题**：上传时出现错误
**解决**：
1. 确保 `hosted-apps` bucket 已创建且为 public
2. 检查文件大小（Supabase 默认限制为 5GB）
3. 检查浏览器控制台的详细错误信息
4. 确保已登录

### 应用无法加载

**问题**：iframe 中显示空白或错误
**解决**：
1. 检查文件是否正确上传到 Storage
2. 确保入口文件名称正确（`index.html` 或上传的文件名）
3. 检查文件内容是否有效的 HTML
4. 查看浏览器控制台的 CORS 或加载错误

### 看不到已发布的应用

**问题**：在应用库中看不到发布的应用
**解决**：
1. 确保在 **我的应用** 中点击了 **发布** 按钮
2. 刷新应用库页面
3. 检查 `is_published` 字段是否为 `true`

## 联系和反馈

如有问题或建议，请通过应用内的反馈功能联系我们。
