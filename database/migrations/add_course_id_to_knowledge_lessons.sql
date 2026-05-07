-- 为 knowledge_lessons 增加课程归属字段
-- 执行后，每个课节可通过 course_id 归属到独立课程详情页

ALTER TABLE knowledge_lessons
ADD COLUMN IF NOT EXISTS course_id TEXT;

CREATE INDEX IF NOT EXISTS idx_knowledge_lessons_course_id
ON knowledge_lessons(course_id);

COMMENT ON COLUMN knowledge_lessons.course_id IS '所属课程ID，对应 course_settings.id';
