-- 获取所有待分类工具的详细信息
-- 用于AI分析判断分类

SELECT 
  id,
  name,
  tagline,
  description,
  category as old_category,
  tags,
  website_url,
  view_count,
  rating,
  status
FROM tools 
WHERE status IN ('approved', 'active') 
  AND (main_category IS NULL OR sub_category IS NULL)
ORDER BY view_count DESC;
