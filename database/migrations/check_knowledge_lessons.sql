-- 检查 knowledge_lessons 表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'knowledge_lessons';

-- 检查 RLS 策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'knowledge_lessons';

-- 检查表中的数据
SELECT COUNT(*) as total_lessons FROM knowledge_lessons;

-- 检查最近的几条数据
SELECT id, title, video_embed_url, doc_embed_url, status 
FROM knowledge_lessons 
ORDER BY created_at DESC 
LIMIT 5;
