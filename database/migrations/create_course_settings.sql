-- 创建课程信息配置表
-- 用于存储课程的基本信息（名称、描述、封面等）

-- 创建表
CREATE TABLE IF NOT EXISTS course_settings (
    id TEXT PRIMARY KEY DEFAULT '1',
    title TEXT NOT NULL DEFAULT '超级个体：AI工具掌控与产品设计指南',
    description TEXT NOT NULL DEFAULT '用 AI 把你从「执行者」变成「决策者」',
    cover_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建存储课程资源的 bucket（如果不存在）
-- 注意：这需要在 Supabase Storage 界面手动创建，或者在 Supabase Dashboard 中执行
-- INSERT INTO storage.buckets (id, name, public) VALUES ('course-assets', 'course-assets', true);

-- 初始化默认数据
INSERT INTO course_settings (id, title, description)
VALUES ('1', '超级个体：AI工具掌控与产品设计指南', '用 AI 把你从「执行者」变成「决策者」。系统化的 AI 实战课程，助你掌握 AI 工具，提升工作效率。')
ON CONFLICT (id) DO NOTHING;

-- 添加注释
COMMENT ON TABLE course_settings IS '课程基本信息配置表';
COMMENT ON COLUMN course_settings.title IS '课程名称';
COMMENT ON COLUMN course_settings.description IS '课程描述';
COMMENT ON COLUMN course_settings.cover_url IS '课程封面图片URL';
COMMENT ON COLUMN course_settings.updated_at IS '最后更新时间';
