-- AI智能分类更新SQL
-- 基于深度语义分析的分类结果

UPDATE tools 
SET main_category = CASE id
  WHEN 'tool-1' THEN 'chat'
  WHEN 'tool-2' THEN 'image'
  WHEN 'tool-3' THEN 'chat'
END,
sub_category = CASE id
  WHEN 'tool-1' THEN 'chat_general'
  WHEN 'tool-2' THEN 'image_generation'
  WHEN 'tool-3' THEN 'chat_general'
END
WHERE id IN ('tool-1', 'tool-2', 'tool-3');

-- 分类结果统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;

-- AI分析详情
SELECT 
  name,
  main_category,
  sub_category,
  'ChatGPT: 识别为对话类：基于AI的交互式问答和交流功能 -> 通用对话：综合对话功能; Midjourney: 识别为图像类：视觉内容创作、设计和图像处理 -> 绘图生成：AI艺术创作和图像生成; GitHub Copilot: 识别为对话类：基于AI的交互式问答和交流功能 -> 通用对话：综合对话功能' as ai_analysis_summary
FROM tools 
WHERE id IN ('tool-1', 'tool-2', 'tool-3')
ORDER BY view_count DESC;
