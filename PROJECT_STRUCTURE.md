# 📚 项目文档结构总览

## 📁 完整项目结构

```
ai-discovery-hub-main/
├── 📚 docs/                           # 📖 所有文档集中管理
│   ├── README.md                      # 📋 文档总览和导航
│   ├── 🤖 ai-review/                   # AI审核相关文档
│   │   ├── AI_REVIEW_GUIDE.md          # AI审核使用指南
│   │   └── AUTO_AI_REVIEW_DEPLOYMENT.md # 自动AI审核部署指南
│   ├── 📧 email-setup/                  # 邮件配置相关文档
│   │   ├── GMAIL_EMAIL_SETUP.md       # Gmail邮件配置
│   │   └── MODERN_EMAIL_SETUP.md       # 现代邮件服务配置
│   ├── 🔐 auth/                        # 认证相关文档
│   │   └── SIMPLE_AUTH_README.md       # 简单认证系统说明
│   ├── 🛠️ scripts/                     # 脚本管理相关文档
│   │   └── 脚本功能说明.md               # 脚本功能详细说明
│   └── 👨‍💼 admin/                       # 管理员相关文档
│       └── 审核状态说明.md               # 审核流程说明
├── 🛠️ scripts/                          # 🔧 所有管理脚本
│   ├── fetch-ai-tools.js               # AI工具数据获取
│   ├── complete-duplicate-cleanup.js   # 完整重复工具清理 ⭐
│   ├── delete-with-real-service-key.js # Service Role Key删除 ⭐
│   ├── check-supabase-permissions.js   # 权限检查 ⭐
│   ├── check-deletion-results.js       # 删除结果验证
│   ├── audit-duplicate-tools.js        # 重复工具审核
│   ├── audit-existing-tools.js         # 现有工具审核
│   ├── audit-tools-table.js            # 工具表审核
│   ├── create-tables.js                # 表创建
│   ├── create-admin.sh                 # 管理员创建
│   ├── collect-ai-tools.js             # AI工具收集
│   └── collect-ai-tools-simple.js      # 简化AI工具收集
├── 🗄️ src/                              # 💻 源代码
│   ├── components/                      # React组件
│   ├── lib/                            # 工具库和服务
│   ├── pages/                          # 页面组件
│   └── hooks/                          # React Hooks
├── 🗄️ database/                        # 📊 数据库相关
│   └── migrations/                     # 数据库迁移文件
├── 🗄️ supabase/                        # ☁️ Supabase配置
├── 🗄️ scheduler/                       # ⏰ 定时任务
├── 🗄️ public/                          # 🌐 静态资源
├── 🗄️ .lovable/                        # 🎨 项目配置
├── 📄 README.md                        # 📖 项目主说明
├── ⚙️ package.json                     # 📦 项目配置
├── 🔧 vite.config.ts                  # ⚡ Vite配置
├── 🎨 tailwind.config.ts              # 🎨 Tailwind配置
├── 📝 tsconfig.json                   # 📝 TypeScript配置
└── 🔐 .env                            # 🔐 环境变量
```

## 🎯 功能模块对应关系

### 🤖 AI审核功能
- **文档**: `docs/ai-review/`
- **代码**: `src/lib/deepseek-service.ts`, `src/pages/Admin.tsx`
- **脚本**: `scripts/complete-duplicate-cleanup.js`

### 📧 邮件通知功能
- **文档**: `docs/email-setup/`
- **代码**: `src/lib/email-service.ts`
- **配置**: `.env` 中的邮件配置

### 🔐 用户认证功能
- **文档**: `docs/auth/`
- **代码**: `src/contexts/AuthContext.tsx`
- **配置**: Supabase认证设置

### 👨‍💼 管理员功能
- **文档**: `docs/admin/`
- **代码**: `src/pages/Admin.tsx`, `src/pages/CreateAdmin.tsx`
- **脚本**: `scripts/create-admin.sh`

### 🛠️ 脚本管理功能
- **文档**: `docs/scripts/`
- **脚本**: `scripts/` 目录下所有脚本
- **配置**: `.env` 中的数据库配置

## 🚀 快速查找指南

### 📖 查找功能文档
1. **AI审核**: `docs/ai-review/AI_REVIEW_GUIDE.md`
2. **邮件配置**: `docs/email-setup/MODERN_EMAIL_SETUP.md`
3. **脚本使用**: `docs/scripts/脚本功能说明.md`
4. **管理员操作**: `docs/admin/审核状态说明.md`

### 🔧 查找代码文件
1. **AI服务**: `src/lib/deepseek-service.ts`
2. **邮件服务**: `src/lib/email-service.ts`
3. **认证上下文**: `src/contexts/AuthContext.tsx`
4. **管理员页面**: `src/pages/Admin.tsx`

### 🛠️ 查找脚本文件
1. **重复工具清理**: `scripts/complete-duplicate-cleanup.js`
2. **权限检查**: `scripts/check-supabase-permissions.js`
3. **数据获取**: `scripts/fetch-ai-tools.js`
4. **表创建**: `scripts/create-tables.js`

## 📋 维护建议

### 🔄 文档维护
- 📅 **定期检查**: 功能变更时同步更新文档
- 🔗 **交叉引用**: 相关文档之间建立链接
- 📊 **版本记录**: 重要变更记录版本信息

### 🗂️ 代码维护
- 📁 **模块化**: 按功能模块组织代码
- 📝 **注释规范**: 重要函数添加中文注释
- 🧪 **测试覆盖**: 关键功能添加测试

### 🛠️ 脚本维护
- 📋 **文档同步**: 脚本变更时更新说明文档
- 🔧 **路径统一**: 使用相对路径引用
- 📊 **日志记录**: 重要操作添加日志输出

---

*项目结构整理完成 - 2026-02-12*
