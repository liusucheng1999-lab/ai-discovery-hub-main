# AI工具智能分类系统 - 使用指南

## 系统概述

针对 aimakerbox.com 网站的 tools 工具数据表，实现全量抓取、AI智能分类和批量更新的完整解决方案。

## 核心功能

1. **全量数据抓取**: 从 Supabase 数据库抓取所有工具数据
2. **AI智能分类**: 基于深度语义分析的二级分类判断
3. **批量更新**: 安全高效的批量数据更新
4. **结果验证**: 完整性和准确性验证

## 文件结构

```
scripts/
├── fetch-all-tools-data.js        # 全量数据抓取脚本
├── ai-smart-categorization.js     # AI智能分类脚本
├── batch-update-categories.js     # 批量更新脚本
├── verify-category-update.js      # 验证更新脚本
└── outputs/                        # 输出文件目录
    ├── tools_data_*.json          # 原始工具数据
    ├── tools_for_ai_*.json        # AI分析用数据
    ├── ai_categorization_results_*.json  # 分类结果
    ├── update_categories_*.sql     # 更新SQL脚本
    ├── update_report_*.json       # 更新报告
    └── verification_report_*.json # 验证报告
```

## 使用步骤

### 第一步: 全量数据抓取

```bash
node scripts/fetch-all-tools-data.js
```

**功能说明:**
- 分页抓取 tools 表中的所有工具数据
- 包含完整的工具信息（名称、描述、标签、网站等）
- 生成数据质量分析报告
- 保存原始数据和简化数据（供AI分析使用）

**输出文件:**
- `tools_data_[timestamp].json` - 完整工具数据
- `tools_for_ai_[timestamp].json` - 简化的AI分析数据

### 第二步: AI智能分类

```bash
node scripts/ai-smart-categorization.js
```

**功能说明:**
- 基于预定义规则的智能分类系统
- 支持10个主分类和40个子分类
- 每个工具都会生成分类理由和置信度
- 可扩展支持DeepSeek AI API（可选）

**分类体系:**
- 💬 对话: 通用对话、专业问答、角色陪伴、多模态
- ✍️ 写作: 文案营销、学术科研、商务办公、翻译润色
- 🎨 图像: 绘图生成、设计辅助、图像编辑、识别提取
- 🎬 视频: 视频生成、视频剪辑、画质修复
- 🎵 音频: 语音合成、音乐创作、语音转录
- 💻 编程: 代码生成、技术文档、测试运维
- 🔍 搜索: 智能搜索、学术检索、数据调研
- 📊 办公: 文档处理、表格数据、演示制作、会议辅助
- 🤖 资源: 开发平台、插件集合、其他网站
- 🛠️ 工具: 模型平台、提示工程、开发框架、内容检测

**输出文件:**
- `ai_categorization_results_[timestamp].json` - 详细分类结果
- `update_categories_[timestamp].sql` - SQL更新脚本

### 第三步: 批量更新数据

```bash
node scripts/batch-update-categories.js
```

**功能说明:**
- 安全的批量更新，保留其他字段不变
- 分批处理，避免请求过大
- 实时进度显示和错误处理
- 跳过无需更新的工具

**安全特性:**
- 只更新 main_category 和 sub_category 字段
- 保留其他所有字段不变
- 详细的错误日志和失败重试
- 更新前后的对比验证

**输出文件:**
- `update_report_[timestamp].json` - 更新操作报告

### 第四步: 验证更新结果

```bash
node scripts/verify-category-update.js
```

**功能说明:**
- 检查分类覆盖率
- 验证分类完整性
- 分析分类分布合理性
- 生成改进建议

**验证项目:**
- 分类覆盖率统计
- 无效分类检查
- 孤立子分类检查
- 分布均衡性分析
- 空分类和稀疏分类识别

**输出文件:**
- `verification_report_[timestamp].json` - 验证报告

## 配置说明

### 环境变量配置

确保 `.env` 文件包含以下配置:

```env
# Supabase配置
VITE_SUPABASE_URL=https://enzduxajblrfbbdktieo.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# DeepSeek API配置（可选）
VITE_DEEPSEEK_API_KEY=sk-your-api-key
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 数据库权限

确保使用的 Supabase Key 具有以下权限:
- `tools` 表的 SELECT、UPDATE 权限
- `main_categories` 表的 SELECT 权限
- `sub_categories` 表的 SELECT 权限

## 注意事项

### 数据安全
- 所有脚本都会创建备份文件
- 更新操作可以随时中断和恢复
- 详细的操作日志便于问题追踪

### 性能优化
- 分页抓取避免内存溢出
- 批量更新控制请求频率
- 异步处理提高执行效率

### 错误处理
- 网络错误自动重试
- 数据验证防止错误更新
- 详细的错误信息便于调试

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 Supabase URL 和 Key 配置
   - 确认网络连接正常
   - 验证数据库权限

2. **AI分类准确率低**
   - 检查工具数据完整性
   - 调整分类规则关键词
   - 考虑启用 DeepSeek AI API

3. **批量更新失败**
   - 检查更新SQL语法
   - 验证分类ID有效性
   - 查看详细错误日志

4. **验证发现问题**
   - 检查分类定义完整性
   - 验证数据一致性
   - 根据建议进行修复

### 恢复操作

如果需要回滚更新:
1. 查看更新报告中的错误信息
2. 手动修复有问题的工具分类
3. 重新运行验证脚本确认修复

## 扩展功能

### 自定义分类规则

可以在 `ai-smart-categorization.js` 中的 `CATEGORY_RULES` 对象添加新的分类规则:

```javascript
const CATEGORY_RULES = {
  // 添加新的主分类
  new_category: {
    keywords: ['关键词1', '关键词2'],
    subCategories: {
      new_sub_category: {
        keywords: ['子关键词1', '子关键词2'],
        name: '新子分类',
        description: '描述信息'
      }
    }
  }
};
```

### 集成其他AI服务

可以扩展 `analyzeToolWithAI` 函数支持其他AI服务:
- OpenAI GPT API
- Claude API
- 本地大模型

## 监控和维护

### 定期检查
建议定期运行验证脚本检查分类质量:
```bash
node scripts/verify-category-update.js
```

### 数据更新
当有新工具添加时，可以单独运行分类脚本:
```bash
node scripts/ai-smart-categorization.js
node scripts/batch-update-categories.js
```

### 性能监控
- 监控数据库查询性能
- 跟踪API调用频率
- 记录错误率和成功率

## 技术支持

如遇到问题，请检查:
1. 控制台输出的错误信息
2. 生成的日志文件
3. 数据库连接状态
4. API响应结果

---

**版本**: 1.0.0  
**更新时间**: 2026-03-18  
**维护者**: AI创客开发团队
