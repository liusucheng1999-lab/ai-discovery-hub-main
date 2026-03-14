-- 更新资源分类脚本
-- 将Agent分类调整为资源，包含三个子分类

-- 1. 更新主分类名称为资源
UPDATE main_categories 
SET name = '资源', 
    description = 'AI构建平台、插件商店、模型社区'
WHERE id = 'ai_agent';

-- 2. 确保资源分类存在
INSERT INTO main_categories (id, name, icon, description, sort_order) 
VALUES ('ai_agent', '资源', '🤖', 'AI构建平台、插件商店、模型社区', 9)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 3. 更新子分类为新的三个分类
-- 先删除旧的子分类
DELETE FROM sub_categories WHERE main_category_id = 'ai_agent';

-- 插入新的子分类
INSERT INTO sub_categories (id, name, main_category_id, description, sort_order) VALUES
('ai_platform', '开发平台', 'ai_agent', '扣子(Coze)、Dify、灵境、智能体构建器', 1),
('ai_plugins', '插件集合', 'ai_agent', 'GPTs 商店、浏览器扩展插件集、应用插件', 2),
('ai_other', '其他网站', 'ai_agent', 'AI导航站、模型社区、资讯聚合', 3)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  main_category_id = EXCLUDED.main_category_id,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 4. 检查分类数据
SELECT 
  '主分类' as type,
  id,
  name,
  icon,
  sort_order
FROM main_categories 
WHERE id = 'ai_agent'

UNION ALL

SELECT 
  '子分类' as type,
  id,
  name,
  '' as icon,
  sort_order
FROM sub_categories 
WHERE main_category_id = 'ai_agent'
ORDER BY type, sort_order;

-- 5. 更新现有工具的分类（将旧的agent相关子分类重新分配）
UPDATE tools 
SET sub_category = CASE 
  WHEN sub_category IN ('ai_customer_service') THEN 'ai_other'  -- 客服系统归到其他网站
  WHEN sub_category IN ('ai_agent') THEN 'ai_platform'  -- 任务代理归到开发平台
  ELSE sub_category
END
WHERE main_category = 'ai_agent' 
  AND sub_category IS NOT NULL;

-- 6. 显示更新后的分类统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category = 'ai_agent'
GROUP BY main_category, sub_category 
ORDER BY tool_count DESC;
