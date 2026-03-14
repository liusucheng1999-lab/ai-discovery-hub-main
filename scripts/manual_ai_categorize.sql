-- 手动AI分类脚本
-- 逐个查看工具信息并手动分配分类

-- 1. 查看前10个待分类工具
SELECT 
  id,
  name,
  tagline,
  description,
  category as old_category,
  tags,
  view_count,
  '待分类' as status
FROM tools 
WHERE status IN ('approved', 'active') 
  AND (main_category IS NULL OR sub_category IS NULL)
ORDER BY view_count DESC
LIMIT 10;

-- 2. 手动更新分类示例（请根据实际情况修改）
-- UPDATE tools 
-- SET main_category = 'chat', 
--     sub_category = 'chat_general'
-- WHERE id = '工具ID';

-- 3. 批量更新模板（复制并修改具体工具ID和分类）
/*
UPDATE tools SET 
  main_category = CASE 
    WHEN id = 'tool-id-1' THEN 'chat'
    WHEN id = 'tool-id-2' THEN 'writing'
    WHEN id = 'tool-id-3' THEN 'image'
    -- 添加更多工具...
  END,
  sub_category = CASE 
    WHEN id = 'tool-id-1' THEN 'chat_general'
    WHEN id = 'tool-id-2' THEN 'writing_marketing'
    WHEN id = 'tool-id-3' THEN 'image_generation'
    -- 添加更多工具...
  END
WHERE id IN ('tool-id-1', 'tool-id-2', 'tool-id-3'); -- 列出所有要更新的工具ID
*/

-- 4. 检查分类进度
SELECT 
  COUNT(*) as total_tools,
  COUNT(CASE WHEN main_category IS NOT NULL THEN 1 END) as categorized_tools,
  COUNT(CASE WHEN main_category IS NULL THEN 1 END) as uncategorized_tools,
  ROUND(
    (COUNT(CASE WHEN main_category IS NOT NULL THEN 1 END) * 100.0 / COUNT(*)), 
    2
  ) as completion_percentage
FROM tools 
WHERE status IN ('approved', 'active');

-- 5. 查看当前分类分布
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;
