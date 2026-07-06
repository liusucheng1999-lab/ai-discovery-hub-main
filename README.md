# AI创客社区 · aimakerbox.com

> 免费托管和分享 AI HTML 应用的社区平台——上传即上线，一个链接分享给所有人。

**网站地址：[aimakerbox.com](https://aimakerbox.com)**

---

## 功能介绍

### 产品社区（首页）
创作者发布、使用者发现 AI 应用的核心社区。

- **上传 HTML / ZIP**：把 AI 帮你生成的应用拖进去，30 秒生成可访问链接
- **连接 GitHub 自动同步**：填写 GitHub 文件链接，每次推送代码网站自动更新，无需手动重传
- **私密链接**：选择不公开展示，仅通过链接分享，无需审核，支持查看和下载源码
- **AI 提示词辅助**：平台内置提示词，帮助用户让 AI 配置 GitHub Actions 自动同步
- 浏览社区内所有公开 AI 应用，点开即玩，无需安装，手机电脑均支持

### AI 工具（/tools）
精选 AI 工具导航，帮助用户找到最适合自己的 AI 工具。

- 收录 1000+ AI 工具，覆盖写作、绘图、办公、视频、编程等分类
- 支持关键词搜索、分类筛选、排序
- 每个工具有详情页，包含功能介绍、使用场景、价格说明
- 管理员可在线增删改工具内容

### AI 课程（/knowledge）
系统化的 AI 学习内容，帮助用户从零上手 AI。

- 多套完整课程，每套课程包含多节课
- 支持免费 / 付费课程区分
- 管理员可在线编辑课程和课时内容

### AI 资源（/resources）
可下载的 AI 相关资源合集。

- 收录 AI 提示词模板、工具包、学习资料等
- 支持分类浏览和关键词检索
- 资源详情页支持下载或跳转获取

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React + Vite + TypeScript + Tailwind CSS + shadcn/ui |
| 后端 / 数据库 | Supabase（Auth + PostgreSQL + Storage + RLS） |
| 部署 | Vercel（前端 + Serverless Functions） |
| 同步机制 | GitHub Actions → POST `/api/sync-app` → Supabase Storage |

---

## 架构说明

```
用户推送代码到 GitHub
       ↓
GitHub Actions 触发（.github/workflows/sync-to-aimakerbox.yml）
       ↓
POST https://aimakerbox.com/api/sync-app?app_id=xxx
       ↓
Vercel Serverless Function（服务端，绕过中国防火墙）
       ↓
从 GitHub raw 拉取 HTML 文件
       ↓
上传到 Supabase Storage（新加坡节点）
       ↓
用户访问时从 Storage 加载最新版本
```

---

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/liusucheng1999-lab/ai-discovery-hub-main.git
cd ai-discovery-hub-main

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 填写 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY

# 启动开发服务器
npm run dev
```

### 环境变量

| 变量名 | 说明 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名公钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端密钥（Vercel 函数用，不暴露给前端） |

---

## 数据库结构

核心表 `hosted_apps`：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 应用唯一 ID |
| `user_id` | uuid | 创作者 |
| `name` | text | 应用名称 |
| `description` | text | 应用描述 |
| `app_file_path` | text | Supabase Storage 文件路径 |
| `cover_image_url` | text | 封面图 URL |
| `status` | text | `pending` / `approved` / `rejected` |
| `is_private` | boolean | 是否私密链接 |
| `github_url` | text | GitHub 文件链接 |
| `github_synced_at` | timestamptz | 最后同步时间 |
| `view_count` | int | 浏览次数 |
| `run_count` | int | 运行次数 |

---

## API

| 接口 | 说明 |
|------|------|
| `POST /api/sync-app?app_id=xxx` | 从 GitHub 同步单个应用（供 GitHub Actions 调用） |
| `GET /api/sitemap` | 动态生成 XML sitemap，包含所有公开应用页面 |

---

## 部署

项目部署在 Vercel，推送到 `main` 分支自动触发部署。

Vercel 需配置以下环境变量：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## License

[CC BY-NC 4.0](LICENSE) · 可学习参考和二次开发，**不可用于商业用途**。
