-- 创建二级分类系统
-- 添加主分类和子分类表，并更新工具表支持二级分类

-- 1. 创建主分类表（一级分类）
CREATE TABLE IF NOT EXISTS main_categories (
  id TEXT PRIMARY KEY,  -- 如 'chat', 'writing', 'image'
  name TEXT NOT NULL,    -- 如 '对话', '写作', '图像'
  icon TEXT NOT NULL,   -- 如 '💬', '✍️', '🎨'
  description TEXT,     -- 分类描述
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建子分类表（二级分类）
CREATE TABLE IF NOT EXISTS sub_categories (
  id TEXT PRIMARY KEY,      -- 如 'chat_general', 'writing_marketing'
  name TEXT NOT NULL,       -- 如 '通用对话', '文案营销'
  main_category_id TEXT NOT NULL REFERENCES main_categories(id) ON DELETE CASCADE,
  description TEXT,         -- 子分类描述
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 为工具表添加二级分类支持
ALTER TABLE tools ADD COLUMN IF NOT EXISTS main_category TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS sub_category TEXT;

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_main_categories_sort_order ON main_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_sub_categories_main_category ON sub_categories(main_category_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_sort_order ON sub_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_tools_main_category ON tools(main_category);
CREATE INDEX IF NOT EXISTS idx_tools_sub_category ON tools(sub_category);

-- 5. 插入主分类数据
INSERT INTO main_categories (id, name, icon, description, sort_order) VALUES
('chat', '对话', '💬', '即时问答、通用助手、交互入口', 1),
('writing', '写作', '✍️', '文本生成、创意创作、润色翻译', 2),
('image', '图像', '🎨', '视觉艺术、平面设计、图像处理', 3),
('video', '视频', '🎬', '动态影像生成、剪辑、后期处理', 4),
('audio', '音频', '🎵', '声音处理、音乐创作、播客录制', 5),
('coding', '编程', '💻', '代码编写、软件开发、技术文档', 6),
('search', '搜索', '🔍', '信息检索、深度调研、知识问答', 7),
('office', '办公', '📊', '职场生产力、格式转换、多端协作', 8),
('ai_agent', '资源', '🤖', 'AI构建平台、插件商店、模型社区', 9),
('tools', '工具', '🛠️', '底层设施、开发者资源、提示工程', 10)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 6. 插入子分类数据
INSERT INTO sub_categories (id, name, main_category_id, description, sort_order) VALUES
-- 💬 对话类子分类
('chat_general', '通用对话', 'chat', 'ChatGPT、Claude、Gemini、Kimi等通用AI', 1),
('chat_professional', '专业问答', 'chat', '法律咨询、医疗健康、金融理财等专业问答', 2),
('chat_companion', '角色陪伴', 'chat', '情感咨询、二次元人设、历史名人虚拟对话', 3),
('chat_multimodal', '多模态', 'chat', '支持图片识别、语音交互、文件分析的助手', 4),

-- ✍️ 写作类子分类
('writing_marketing', '文案营销', 'writing', '广告语、小红书文案、SEO描述、产品详情', 1),
('writing_academic', '学术科研', 'writing', '论文大纲、文献总结、改写纠错、开题报告', 2),
('writing_business', '商务办公', 'writing', '邮件往来、简历优化、日报周报、商业计划', 3),
('writing_translation', '翻译润色', 'writing', '多语言翻译、语法校对、风格修饰、同声传译', 4),

-- 🎨 图像类子分类
('image_generation', '绘图生成', 'image', '文生图、AI绘画、Midjourney等艺术创作', 1),
('image_design', '设计辅助', 'image', 'Logo生成、UI设计、电商海报、3D建模', 2),
('image_editing', '图像编辑', 'image', '老照片修复、背景移除、无损放大、涂抹修改', 3),
('image_recognition', '识别提取', 'image', 'OCR文字识别、物体识别、以图搜图', 4),

-- 🎬 视频类子分类
('video_generation', '视频生成', 'video', '文生视频、图生视频、虚拟数字人生成', 1),
('video_editing', '视频剪辑', 'video', '自动剪辑、特效合成、字幕生成、配音对口型', 2),
('video_enhancement', '画质修复', 'video', '视频补帧、画质增强、去除水印、格式转换', 3),

-- 🎵 音频类子分类
('audio_synthesis', '语音合成', 'audio', '文字转语音、克隆人声、情感配音', 1),
('audio_composition', '音乐创作', 'audio', 'AI作曲、编曲、歌词生成、伴奏分离', 2),
('audio_transcription', '语音转录', 'audio', '会议录音转文字、实时翻译、声纹识别', 3),

-- 💻 编程类子分类
('coding_generation', '代码生成', 'coding', '自动补全、代码纠错、逻辑生成', 1),
('coding_documentation', '技术文档', 'coding', 'API文档自动生成、代码注释、流程图绘制', 2),
('coding_testing', '测试运维', 'coding', '自动化测试、SQL优化、服务器监控、Bug检测', 3),

-- 🔍 搜索类子分类
('search_smart', '智能搜索', 'search', 'AI搜索引擎、实时联网问答', 1),
('search_academic', '学术检索', 'search', '专业期刊搜索、引用标注、文献综述工具', 2),
('search_research', '数据调研', 'search', '行业数据抓取、竞品分析、市场报告生成', 3),

-- 📊 办公类子分类
('office_document', '文档处理', 'office', 'PDF解析、长文档总结、格式转换', 1),
('office_data', '表格数据', 'office', 'Excel公式助手、数据可视化、报表生成', 2),
('office_presentation', '演示制作', 'office', 'AI生成PPT、大纲转PPT、演示模版设计', 3),
('office_meeting', '会议辅助', 'office', '日程管理、纪要整理、任务分配', 4),

-- 🤖 资源类子分类
('ai_platform', '开发平台', 'ai_agent', '扣子(Coze)、Dify、灵境、智能体构建器', 1),
('ai_plugins', '插件集合', 'ai_agent', 'GPTs 商店、浏览器扩展插件集、应用插件', 2),
('ai_other', '其他网站', 'ai_agent', 'AI导航站、模型社区、资讯聚合', 3),

-- 🛠️ 工具类子分类
('tools_model', '模型平台', 'tools', '大模型 API、模型市场、Hugging Face', 1),
('tools_prompt', '提示工程', 'tools', 'Prompt 词库、提示词优化、提示词破解', 2),
('tools_framework', '开发框架', 'tools', 'LangChain、向量数据库、部署环境', 3),
('tools_detection', '内容检测', 'tools', 'AI生成内容识别、查重、安全性检测', 4)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  main_category_id = EXCLUDED.main_category_id,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;
