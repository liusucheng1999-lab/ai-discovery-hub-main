# 二级分类系统部署指南

## 概述

本系统将原有的单层分类升级为一级和二级分类系统，提供更精细的工具分类和筛选功能。

## 分类结构

### 一级分类（10个）
- 💬 对话 - 即时问答、通用助手、交互入口
- ✍️ 写作 - 文本生成、创意创作、润色翻译
- 🎨 图像 - 视觉艺术、平面设计、图像处理
- 🎬 视频 - 动态影像生成、剪辑、后期处理
- 🎵 音频 - 声音处理、音乐创作、播客录制
- 💻 编程 - 代码编写、软件开发、技术文档
- 🔍 搜索 - 信息检索、深度调研、知识问答
- 📊 办公 - 职场生产力、格式转换、多端协作
- 🤖 资源 - AI构建平台、插件商店、模型社区
- 🛠️ 工具 - 底层设施、开发者资源、提示工程

### 二级分类（40个）
每个一级分类下包含4个二级分类，详见数据库迁移脚本。

## 部署步骤

### 1. 执行数据库迁移

```sql
-- 在 Supabase SQL 编辑器中执行
-- 文件：database/migrations/add_two_level_category_system.sql
```

该脚本会：
- 创建 `main_categories` 表（一级分类）
- 创建 `sub_categories` 表（二级分类）
- 为 `tools` 表添加 `main_category` 和 `sub_category` 字段
- 插入所有分类数据
- 创建必要的索引

### 2. 为现有工具分配分类

```sql
-- 在 Supabase SQL 编辑器中执行
-- 文件：scripts/assign_tool_categories.sql
```

该脚本会：
- 根据工具的现有分类和标签智能分配到新的二级分类系统
- 显示分配结果统计

### 3. 验证部署

执行以下查询验证部署是否成功：

```sql
-- 检查主分类
SELECT COUNT(*) as main_categories_count FROM main_categories;

-- 检查子分类
SELECT COUNT(*) as sub_categories_count FROM sub_categories;

-- 检查工具分类分配
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY tool_count DESC;
```

## 前端更新

### 新增文件
- `src/lib/types.ts` - 分类系统类型定义
- `src/lib/category-service.ts` - 分类数据服务
- `src/components/CategorySelector.tsx` - 分类选择器组件

### 修改文件
- `src/pages/Index.tsx` - 更新首页支持二级分类显示和筛选

## 功能特性

### 1. 向后兼容
- 保持原有 `category` 字段不变
- 新增 `main_category` 和 `sub_category` 字段
- 优先使用新字段，向后兼容旧字段

### 2. 智能分类分配
- 基于工具的现有分类和标签自动分配
- 支持手动调整分类

### 3. 用户界面
- 主分类标签页
- 子分类筛选器
- 分类徽章显示

### 4. 筛选功能
- 按主分类筛选
- 按子分类筛选
- 组合筛选支持

## 数据库结构

### main_categories 表
```sql
CREATE TABLE main_categories (
  id TEXT PRIMARY KEY,           -- 主分类ID
  name TEXT NOT NULL,            -- 分类名称
  icon TEXT NOT NULL,            -- 图标
  description TEXT,               -- 描述
  sort_order INTEGER DEFAULT 0,  -- 排序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### sub_categories 表
```sql
CREATE TABLE sub_categories (
  id TEXT PRIMARY KEY,           -- 子分类ID
  name TEXT NOT NULL,            -- 子分类名称
  main_category_id TEXT NOT NULL REFERENCES main_categories(id),
  description TEXT,               -- 描述
  sort_order INTEGER DEFAULT 0,  -- 排序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### tools 表新增字段
```sql
ALTER TABLE tools ADD COLUMN main_category TEXT;    -- 主分类
ALTER TABLE tools ADD COLUMN sub_category TEXT;     -- 子分类
```

## 后续维护

### 1. 添加新分类
使用 `CategoryService` 中的方法或直接在数据库中添加：

```sql
-- 添加主分类
INSERT INTO main_categories (id, name, icon, description, sort_order) 
VALUES ('new_category', '新分类', '🆕', '新分类描述', 11);

-- 添加子分类
INSERT INTO sub_categories (id, name, main_category_id, description, sort_order)
VALUES ('new_sub_category', '新子分类', 'new_category', '新子分类描述', 1);
```

### 2. 更新工具分类
```sql
UPDATE tools 
SET main_category = 'new_category', 
    sub_category = 'new_sub_category'
WHERE id = 'tool_id';
```

### 3. 分类排序
修改 `sort_order` 字段来调整分类显示顺序。

## 注意事项

1. **备份数据**：执行迁移前请备份数据库
2. **测试环境**：建议先在测试环境验证
3. **渐进部署**：可以分步骤部署，先部署数据库结构，再更新前端
4. **性能优化**：已创建必要索引，如需进一步优化可考虑添加复合索引

## 故障排除

### 常见问题

1. **分类显示不正确**
   - 检查 `main_categories` 和 `sub_categories` 表数据
   - 确认 `tools` 表的分类字段已正确分配

2. **筛选功能异常**
   - 检查前端组件是否正确加载分类数据
   - 确认数据库连接正常

3. **性能问题**
   - 检查索引是否正确创建
   - 考虑添加查询缓存

### 回滚方案

如需回滚到单分类系统：
```sql
-- 删除新增字段
ALTER TABLE tools DROP COLUMN IF EXISTS main_category;
ALTER TABLE tools DROP COLUMN IF EXISTS sub_category;

-- 删除分类表
DROP TABLE IF EXISTS sub_categories;
DROP TABLE IF EXISTS main_categories;
```
