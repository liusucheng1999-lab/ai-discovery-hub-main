# 批量审核后台任务系统实施指南

## 🎯 功能概述

批量AI审核后台任务系统解决了页面关闭后审核中断的问题，实现了真正的后台执行。

## ✨ 主要特性

### 🚀 后台执行
- ✅ 页面关闭后任务继续运行
- ✅ 服务器端执行，不受浏览器影响
- ✅ 任务状态实时同步

### 📊 进度监控
- ✅ 实时进度显示
- ✅ 当前审核工具名称
- ✅ 任务状态跟踪

### 💾 数据持久化
- ✅ 审核结果自动保存
- ✅ 任务历史记录
- ✅ 断点续传支持

## 🛠️ 实施步骤

### 第一步: 创建数据库表

#### 方法1: 使用脚本（推荐）
```bash
node scripts/setup-batch-review.js
```

#### 方法2: 手动执行SQL
在Supabase SQL编辑器中运行 `scripts/create-batch-review-tasks.sql` 中的所有SQL语句：

```sql
-- 创建批量审核任务表
CREATE TABLE IF NOT EXISTS batch_review_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  total_tools INTEGER NOT NULL,
  completed_tools INTEGER DEFAULT 0,
  current_tool_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_by TEXT,
  tool_ids TEXT[] NOT NULL,
  results JSONB DEFAULT '{}'
);

-- 创建审核结果表
CREATE TABLE IF NOT EXISTS ai_review_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES batch_review_tasks(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  review_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  saved_to_tool_submission BOOLEAN DEFAULT FALSE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_batch_review_tasks_status ON batch_review_tasks(status);
CREATE INDEX IF NOT EXISTS idx_batch_review_tasks_created_at ON batch_review_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_review_results_task_id ON ai_review_results(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_review_results_tool_id ON ai_review_results(tool_id);
```

### 第二步: 验证表创建

```bash
node scripts/test-batch-review-tables.js
```

### 第三步: 测试功能

1. 启动应用
2. 进入管理员审核页面
3. 选择几个工具进行批量AI审核
4. 观察后台任务状态显示
5. 可以关闭页面，任务会继续执行

## 🔄 工作流程

### 用户操作流程
```
1. 选择工具 → 2. 点击批量AI审核 → 3. 确认提交 → 4. 后台任务开始 → 5. 实时显示进度 → 6. 完成通知
```

### 系统执行流程
```
提交任务 → 创建任务记录 → 开始执行 → 逐个审核 → 保存结果 → 更新进度 → 完成任务 → 通知用户
```

## 📱 用户界面

### 确认对话框
```
确定要开始批量AI审核吗？

📊 审核信息:
• 工具数量: 10 个
• 预计时间: 30 秒
• 执行方式: 后台任务（页面关闭后继续运行）

✅ 优势:
• 页面关闭后任务继续执行
• 审核结果自动保存
• 可随时查看进度
```

### 进度显示
```
🚀 后台批量审核进行中...
5/10

████████████████████████████████████████████████████
进度条显示

正在审核: 工具名称
任务ID: xxx-xxx-xxx
状态: running
💡 页面关闭后任务将继续运行
```

## 🔧 技术架构

### 前端组件
- **BatchReviewService**: 任务管理服务
- **Admin.tsx**: 用户界面和状态管理
- **进度监控**: 实时状态更新

### 后端服务
- **任务队列**: 数据库任务表
- **执行引擎**: 服务器端审核逻辑
- **状态管理**: 任务状态跟踪

### 数据库表
- **batch_review_tasks**: 任务主表
- **ai_review_results**: 审核结果表

## 📊 监控和管理

### 任务状态
- `pending`: 等待执行
- `running`: 正在执行
- `completed`: 执行完成
- `failed`: 执行失败
- `cancelled`: 用户取消

### 查看任务历史
```typescript
// 获取用户任务列表
const tasks = await batchReviewService.getUserTasks('admin');

// 获取任务进度
const progress = await batchReviewService.getTaskProgress(taskId);

// 获取任务结果
const results = await batchReviewService.getTaskResults(taskId);
```

## 🚨 故障处理

### 常见问题

#### 1. 表创建失败
**症状**: SQL执行错误
**解决**: 检查Supabase权限，手动执行SQL

#### 2. 任务不执行
**症状**: 任务状态一直是pending
**解决**: 检查服务器日志，确认DeepSeek API配置

#### 3. 进度不更新
**症状**: 进度条不动
**解决**: 检查数据库连接，确认任务执行逻辑

#### 4. 结果丢失
**症状**: 完成后没有结果
**解决**: 检查ai_review_results表，确认数据保存

### 调试方法

#### 1. 检查数据库
```sql
-- 查看任务状态
SELECT * FROM batch_review_tasks ORDER BY created_at DESC;

-- 查看审核结果
SELECT * FROM ai_review_results WHERE task_id = 'xxx';
```

#### 2. 查看日志
```bash
# 检查服务器日志
tail -f /var/log/supabase/edge-runtime.log
```

#### 3. 测试API
```typescript
// 测试任务提交
const result = await batchReviewService.submitBatchReviewTask(['tool1', 'tool2']);
console.log(result);
```

## 🔄 维护任务

### 定期清理
```typescript
// 清理7天前的旧任务
await batchReviewService.cleanupOldTasks(7);
```

### 性能监控
- 监控任务执行时间
- 检查API调用频率
- 观察数据库性能

## 🎯 最佳实践

### 用户体验
1. **清晰提示**: 告知用户后台执行的优势
2. **实时反馈**: 显示详细进度信息
3. **完成通知**: 任务完成后及时通知
4. **历史记录**: 保留任务执行历史

### 系统设计
1. **错误处理**: 完善的异常处理机制
2. **资源管理**: 避免API调用过频
3. **数据一致性**: 确保数据完整性
4. **扩展性**: 支持未来功能扩展

### 安全考虑
1. **权限控制**: 限制任务创建权限
2. **数据验证**: 验证输入参数
3. **审计日志**: 记录操作历史
4. **资源限制**: 防止资源滥用

## 🚀 未来扩展

### 计划功能
- [ ] 任务优先级
- [ ] 定时任务
- [ ] 任务重试机制
- [ ] 批量操作优化
- [ ] 实时通知系统
- [ ] 任务模板

### 性能优化
- [ ] 并行执行
- [ ] 缓存机制
- [ ] 负载均衡
- [ ] 资源池管理

---

## 📞 技术支持

如果遇到问题，请：
1. 查看本文档的故障处理部分
2. 检查数据库表是否正确创建
3. 确认API配置正确
4. 查看浏览器控制台错误信息

**注意**: 这个系统需要服务器端执行环境，确保Supabase Edge Functions或类似服务正常运行。
