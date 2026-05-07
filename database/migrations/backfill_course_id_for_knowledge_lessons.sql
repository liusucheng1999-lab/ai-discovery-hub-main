-- 回填老课节的 course_id
-- 在 Supabase SQL 编辑器中执行
-- 规则：
-- 1. 不覆盖已经设置过 course_id 的课节
-- 2. 优先按课程标题精确匹配老字段（week_title / section_label）
-- 3. 仍未匹配到的老课节，如果存在默认课程 id=1，则兜底归属到该课程

-- 如果线上库还没有这个字段，先补上
ALTER TABLE knowledge_lessons
ADD COLUMN IF NOT EXISTS course_id TEXT;

CREATE INDEX IF NOT EXISTS idx_knowledge_lessons_course_id
ON knowledge_lessons(course_id);

COMMENT ON COLUMN knowledge_lessons.course_id IS '所属课程ID，对应 course_settings.id';

-- 先按课程标题精确匹配
UPDATE knowledge_lessons AS kl
SET course_id = cs.id
FROM course_settings AS cs
WHERE kl.course_id IS NULL
  AND (
    lower(trim(coalesce(kl.week_title, ''))) = lower(trim(cs.title))
    OR lower(trim(coalesce(kl.section_label, ''))) = lower(trim(cs.title))
  );

-- 老的单课程数据兜底归到默认课程
UPDATE knowledge_lessons
SET course_id = '1'
WHERE course_id IS NULL
  AND EXISTS (
    SELECT 1
    FROM course_settings
    WHERE id = '1'
  );

-- 检查回填结果
SELECT
  cs.id AS course_id,
  cs.title AS course_title,
  COUNT(kl.id) AS lesson_count
FROM course_settings AS cs
LEFT JOIN knowledge_lessons AS kl
  ON kl.course_id = cs.id
GROUP BY cs.id, cs.title
ORDER BY cs.title;

-- 检查是否仍有未归属课节
SELECT
  id,
  title,
  week_title,
  section_label,
  sort_order
FROM knowledge_lessons
WHERE course_id IS NULL
ORDER BY sort_order, created_at;
