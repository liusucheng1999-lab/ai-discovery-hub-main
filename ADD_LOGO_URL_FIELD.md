# 添加logo_url字段到tools表

## 问题描述
当前tools表缺少logo_url字段，导致每次加载时都需要动态计算工具头像，效率低下且不稳定。

## 解决方案

### 步骤1: 在Supabase控制台添加字段

1. 登录 [Supabase控制台](https://supabase.com/dashboard)
2. 选择项目: `enzduxajblrfbbdktieo`
3. 进入 **SQL编辑器**
4. 运行以下SQL命令：

```sql
ALTER TABLE tools ADD COLUMN logo_url text;
```

5. 点击 **执行** 按钮

### 步骤2: 验证字段添加

运行以下脚本验证字段是否添加成功：

```bash
node scripts/test-logo-field.js
```

应该显示 "✅ 插入成功，logo_url字段已存在"

### 步骤3: 批量更新现有工具的logo_url

```bash
node scripts/update-tools-logo.js
```

### 步骤4: 更新代码

修改 `src/pages/Admin.tsx` 中的批量审核逻辑，启用logo_url保存：

```typescript
const toolToInsert = {
  name: optimizedName,
  tagline: optimizedTagline,
  description: optimizedDescription,
  website_url: tool.website_url,
  logo_url: logoUrl, // 启用logo_url保存
  category: tool.category,
  tags: suggestedTags,
  // ... 其他字段
};
```

## 优势

### 当前问题
- ❌ 每次加载都动态计算logo_url
- ❌ 网络请求可能失败
- ❌ 性能低下
- ❌ 不稳定

### 解决后
- ✅ logo_url存储在数据库中
- ✅ 直接从数据库读取
- ✅ 性能提升
- ✅ 稳定可靠
- ✅ 支持缓存

## 头像获取逻辑

系统会按以下优先级获取头像：

1. **预定义映射**: 常见网站的官方favicon
2. **默认favicon**: `https://domain/favicon.ico`
3. **备用服务**: Google Favicon服务

## 测试验证

完成上述步骤后：

1. 审核通过新工具，检查是否保存了logo_url
2. 在首页查看工具头像显示
3. 检查数据库中logo_url字段值

## 注意事项

- 确保在添加字段后再运行批量更新脚本
- 如果某些工具的logo_url获取失败，可以手动更新
- 定期检查favicon链接的有效性
