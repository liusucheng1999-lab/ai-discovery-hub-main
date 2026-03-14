-- 检查Agent分类数据
-- 查看main_categories表中是否有Agent分类

SELECT * FROM main_categories WHERE id = 'ai_agent' OR name LIKE '%Agent%' OR name LIKE '%智能%';

-- 检查sub_categories表中Agent相关的子分类
SELECT * FROM sub_categories WHERE main_category_id = 'ai_agent';

-- 检查tools表中是否有agent分类的工具
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;
