-- 更新分类数据脚本
-- 确保Agent分类正确设置

-- 1. 更新主分类名称为Agent
UPDATE main_categories 
SET name = 'Agent' 
WHERE id = 'ai_agent';

-- 2. 确保Agent分类存在
INSERT INTO main_categories (id, name, icon, description, sort_order) 
VALUES ('ai_agent', 'Agent', '🤖', '智能体构建、自动化、复杂任务处理', 9)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 3. 确保Agent子分类存在
INSERT INTO sub_categories (id, name, main_category_id, description, sort_order) VALUES
('ai_platform', '开发平台', 'ai_agent', '扣子(Coze)、Dify、灵境、智能体构建器', 1),
('ai_agent', '任务代理', 'ai_agent', '自主拆解目标的智能体、自动化工作流', 2),
('ai_customer_service', '客服系统', 'ai_agent', '企业级智能客服、售后机器人', 3),
('ai_plugins', '插件集合', 'ai_agent', 'GPTs 商店、浏览器扩展插件集', 4)
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
