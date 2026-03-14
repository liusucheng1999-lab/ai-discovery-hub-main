-- 检查当前工具分类情况
-- 执行分类分配前的数据统计

-- 1. 查看当前工具分类分布
SELECT 
  category,
  COUNT(*) as tool_count,
  array_agg(name ORDER BY view_count DESC LIMIT 5) as sample_tools
FROM tools 
WHERE status IN ('approved', 'active') 
GROUP BY category 
ORDER BY tool_count DESC;

-- 2. 查看未分类的工具
SELECT 
  COUNT(*) as unclassified_count,
  array_agg(name ORDER BY view_count DESC LIMIT 10) as sample_unclassified
FROM tools 
WHERE status IN ('approved', 'active') 
  AND (category IS NULL OR category = '');

-- 3. 查看标签分布情况
SELECT 
  tag,
  COUNT(*) as tool_count
FROM tools, unnest(tags) as tag
WHERE status IN ('approved', 'active')
GROUP BY tag
ORDER BY tool_count DESC
LIMIT 20;
