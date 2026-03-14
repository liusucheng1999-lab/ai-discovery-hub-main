-- 智能分类分配脚本 v2.0
-- 基于工具名称、描述、标签进行更精确的二级分类分配

-- 首先清除现有的分类分配（重新开始）
UPDATE tools 
SET main_category = NULL, sub_category = NULL 
WHERE status IN ('approved', 'active');

-- 基于工具名称和描述的智能分类分配
UPDATE tools SET 
  main_category = CASE
    
    -- 💬 对话类 - 基于关键词匹配
    WHEN (
      LOWER(name) ~ ANY(ARRAY['chat', 'gpt', 'claude', 'gemini', 'kimi', 'dialog', 'conversation', 'assistant', 'ai助手', '聊天', '对话']) OR
      LOWER(description) ~ ANY(ARRAY['对话', '聊天', '问答', '助手', 'assistant', 'chat', 'conversation']) OR
      tags && ARRAY['对话', '聊天', 'AI助手', 'ChatGPT', 'Claude', '问答']
    ) THEN 'chat'
    
    -- ✍️ 写作类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['write', 'writing', 'essay', 'article', 'content', '文案', '写作', '论文']) OR
      LOWER(description) ~ ANY(ARRAY['写作', '文案', '内容', '文章', '论文', '翻译', '润色']) OR
      tags && ARRAY['写作', '文案', '翻译', '润色', '论文', '内容创作']
    ) THEN 'writing'
    
    -- 🎨 图像类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['image', 'art', 'design', 'draw', 'paint', 'photo', '图像', '绘画', '设计', '艺术']) OR
      LOWER(description) ~ ANY(ARRAY['图像', '绘画', '设计', '艺术', 'AI绘画', '图片', '照片']) OR
      tags && ARRAY['图像', '绘画', '设计', 'AI绘画', 'Midjourney', 'Stable Diffusion', '艺术创作']
    ) THEN 'image'
    
    -- 🎬 视频类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['video', 'movie', 'animation', '视频', '动画', '影片']) OR
      LOWER(description) ~ ANY(ARRAY['视频', '动画', '影片', '剪辑', '制作']) OR
      tags && ARRAY['视频', '动画', '剪辑', '影片制作']
    ) THEN 'video'
    
    -- 🎵 音频类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['audio', 'music', 'voice', 'sound', '音频', '音乐', '语音', '声音']) OR
      LOWER(description) ~ ANY(ARRAY['音频', '音乐', '语音', '配音', '声音', 'TTS']) OR
      tags && ARRAY['音频', '音乐', '语音', '配音', 'TTS', '声音合成']
    ) THEN 'audio'
    
    -- 💻 编程类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['code', 'programming', 'dev', 'api', '代码', '编程', '开发']) OR
      LOWER(description) ~ ANY(ARRAY['编程', '代码', '开发', 'API', '软件开发']) OR
      tags && ARRAY['编程', '代码', '开发', 'API', '软件开发', '程序员']
    ) THEN 'coding'
    
    -- 🔍 搜索类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['search', 'find', 'research', '搜索', '检索', '调研']) OR
      LOWER(description) ~ ANY(ARRAY['搜索', '检索', '调研', '发现', '查找']) OR
      tags && ARRAY['搜索', '检索', '调研', '信息检索']
    ) THEN 'search'
    
    -- 📊 办公类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['office', 'document', 'excel', 'ppt', 'pdf', '办公', '文档', '表格']) OR
      LOWER(description) ~ ANY(ARRAY['办公', '文档', '表格', 'PPT', 'PDF', '工作效率']) OR
      tags && ARRAY['办公', '文档', '表格', 'PPT', 'PDF', '工作效率']
    ) THEN 'office'
    
    -- 🤖 智能类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['agent', 'bot', 'automation', 'workflow', '智能体', '机器人', '自动化']) OR
      LOWER(description) ~ ANY(ARRAY['智能体', 'Agent', '机器人', '自动化', '工作流']) OR
      tags && ARRAY['智能体', 'Agent', '机器人', '自动化', '工作流']
    ) THEN 'ai_agent'
    
    -- 🛠️ 工具类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['tool', 'platform', 'framework', 'model', '工具', '平台', '框架', '模型']) OR
      LOWER(description) ~ ANY(ARRAY['工具', '平台', '框架', '模型', '基础设施']) OR
      tags && ARRAY['工具', '平台', '框架', '模型', '基础设施']
    ) THEN 'tools'
    
    -- 基于原有分类的映射
    ELSE CASE category
      WHEN 'chat' THEN 'chat'
      WHEN 'writing' THEN 'writing'
      WHEN 'image' THEN 'image'
      WHEN 'video' THEN 'video'
      WHEN 'audio' THEN 'audio'
      WHEN 'coding' THEN 'coding'
      WHEN 'search' THEN 'search'
      WHEN 'office' THEN 'office'
      WHEN 'agent' THEN 'ai_agent'
      WHEN 'tools' THEN 'tools'
      ELSE 'tools' -- 默认归类为工具
    END
  END,
  
  sub_category = CASE
    
    -- 💬 对话类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['chat', 'gpt', 'claude', 'gemini', 'kimi', '通用']) OR
      tags && ARRAY['通用', '多模态', '文件分析', 'ChatGPT', 'Claude', 'Gemini']
    ) THEN 'chat_general'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['legal', 'medical', 'finance', 'professional']) OR
      tags && ARRAY['专业', '法律', '医疗', '金融', '咨询']
    ) THEN 'chat_professional'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['companion', 'friend', 'emotional', 'character']) OR
      tags && ARRAY['情感', '陪伴', '人设', '虚拟', '角色']
    ) THEN 'chat_companion'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['multimodal', 'vision', 'voice', 'file']) OR
      tags && ARRAY['多模态', '图片识别', '语音交互', '文件分析']
    ) THEN 'chat_multimodal'
    
    -- ✍️ 写作类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['marketing', 'ad', 'seo', 'copy', '营销', '广告']) OR
      tags && ARRAY['营销', '广告', 'SEO', '文案', '小红书']
    ) THEN 'writing_marketing'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['academic', 'paper', 'thesis', 'research', '学术', '论文']) OR
      tags && ARRAY['学术', '论文', '文献', '研究', '开题报告']
    ) THEN 'writing_academic'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['business', 'email', 'resume', 'report', '商务', '办公']) OR
      tags && ARRAY['商务', '办公', '邮件', '简历', '报告', '周报']
    ) THEN 'writing_business'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['translate', 'translation', 'proofread', '翻译', '润色']) OR
      tags && ARRAY['翻译', '润色', '校对', '语法', '同声传译']
    ) THEN 'writing_translation'
    
    -- 🎨 图像类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['generate', 'create', 'art', 'paint', '生成', '绘画']) OR
      tags && ARRAY['生成', '绘画', '文生图', 'AI绘画', 'Midjourney', 'Stable Diffusion']
    ) THEN 'image_generation'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['design', 'logo', 'ui', 'poster', '设计']) OR
      tags && ARRAY['设计', 'Logo', 'UI', '海报', '3D建模']
    ) THEN 'image_design'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['edit', 'enhance', 'restore', 'remove', '编辑', '修复']) OR
      tags && ARRAY['编辑', '修复', '背景', '放大', '老照片']
    ) THEN 'image_editing'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['ocr', 'recognize', 'detect', '识别']) OR
      tags && ARRAY['识别', 'OCR', '检测', '物体识别']
    ) THEN 'image_recognition'
    
    -- 🎬 视频类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['generate', 'create', 'make', '生成', '制作']) OR
      tags && ARRAY['生成', '文生视频', '数字人', '虚拟人']
    ) THEN 'video_generation'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['edit', 'cut', 'effect', 'subtitle', '编辑', '剪辑']) OR
      tags && ARRAY['剪辑', '编辑', '特效', '字幕', '配音']
    ) THEN 'video_editing'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['enhance', 'restore', 'watermark', 'enhance', '增强']) OR
      tags && ARRAY['修复', '增强', '水印', '补帧', '画质']
    ) THEN 'video_enhancement'
    
    -- 🎵 音频类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['tts', 'voice', 'speak', 'synthesis', '语音', '合成']) OR
      tags && ARRAY['合成', 'TTS', '语音', '配音', '克隆']
    ) THEN 'audio_synthesis'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['music', 'compose', 'song', 'melody', '音乐', '作曲']) OR
      tags && ARRAY['音乐', '作曲', '编曲', '歌词', '伴奏']
    ) THEN 'audio_composition'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['transcribe', 'convert', 'record', '转录', '转文字']) OR
      tags && ARRAY['转录', '转文字', '录音', '翻译', '声纹']
    ) THEN 'audio_transcription'
    
    -- 💻 编程类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['generate', 'complete', 'fix', 'generate', '生成', '补全']) OR
      tags && ARRAY['生成', '补全', '纠错', '逻辑', '代码生成']
    ) THEN 'coding_generation'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['doc', 'comment', 'api', '文档', '注释']) OR
      tags && ARRAY['文档', '注释', 'API文档', '流程图']
    ) THEN 'coding_documentation'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['test', 'debug', 'monitor', '运维', '测试']) OR
      tags && ARRAY['测试', '运维', '监控', 'Bug', 'SQL优化']
    ) THEN 'coding_testing'
    
    -- 🔍 搜索类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['smart', 'ai', 'realtime', '智能', 'AI']) OR
      tags && ARRAY['智能', 'AI搜索', '联网', '实时']
    ) THEN 'search_smart'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['academic', 'paper', 'journal', '学术', '期刊']) OR
      tags && ARRAY['学术', '期刊', '文献', '引用', '综述']
    ) THEN 'search_academic'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['data', 'market', 'analyze', '数据', '市场']) OR
      tags && ARRAY['数据', '竞品', '市场', '报告', '调研']
    ) THEN 'search_research'
    
    -- 📊 办公类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['document', 'pdf', 'convert', '文档', 'PDF']) OR
      tags && ARRAY['文档', 'PDF', '总结', '转换', '解析']
    ) THEN 'office_document'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['excel', 'sheet', 'data', 'chart', '表格', '数据']) OR
      tags && ARRAY['表格', 'Excel', '数据', '报表', '可视化']
    ) THEN 'office_data'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['ppt', 'presentation', 'slide', '演示', '幻灯片']) OR
      tags && ARRAY['PPT', '演示', '幻灯片', '模板']
    ) THEN 'office_presentation'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['meeting', 'schedule', 'task', '会议', '日程']) OR
      tags && ARRAY['会议', '日程', '纪要', '任务', '管理']
    ) THEN 'office_meeting'
    
    -- 🤖 智能类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['platform', 'builder', 'coze', 'dify', '平台', '构建器']) OR
      tags && ARRAY['平台', '构建器', '扣子', 'Dify', '灵境']
    ) THEN 'ai_platform'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['agent', 'workflow', 'task', '代理', '工作流']) OR
      tags && ARRAY['代理', '任务', '工作流', '自动化']
    ) THEN 'ai_agent'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['customer', 'service', 'support', '客服', '服务']) OR
      tags && ARRAY['客服', '机器人', '售后', '服务']
    ) THEN 'ai_customer_service'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['plugin', 'extension', 'gpts', '插件', '扩展']) OR
      tags && ARRAY['插件', 'GPTs', '扩展', '商店']
    ) THEN 'ai_plugins'
    
    -- 🛠️ 工具类子分类
    WHEN (
      LOWER(name) ~ ANY(ARRAY['model', 'api', 'hugging', '模型', 'API']) OR
      tags && ARRAY['模型', 'API', 'Hugging', '大模型']
    ) THEN 'tools_model'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['prompt', 'template', '提示', '词库']) OR
      tags && ARRAY['提示', 'Prompt', '词库', '优化']
    ) THEN 'tools_prompt'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['framework', 'langchain', 'deploy', '框架', '部署']) OR
      tags && ARRAY['框架', 'LangChain', '部署', '环境']
    ) THEN 'tools_framework'
    
    WHEN (
      LOWER(name) ~ ANY(ARRAY['detect', 'check', 'safety', '检测', '安全']) OR
      tags && ARRAY['检测', '查重', '安全', '识别']
    ) THEN 'tools_detection'
    
    -- 默认子分类分配
    ELSE CASE 
      WHEN main_category = 'chat' THEN 'chat_general'
      WHEN main_category = 'writing' THEN 'writing_marketing'
      WHEN main_category = 'image' THEN 'image_generation'
      WHEN main_category = 'video' THEN 'video_editing'
      WHEN main_category = 'audio' THEN 'audio_synthesis'
      WHEN main_category = 'coding' THEN 'coding_generation'
      WHEN main_category = 'search' THEN 'search_smart'
      WHEN main_category = 'office' THEN 'office_document'
      WHEN main_category = 'ai_agent' THEN 'ai_platform'
      WHEN main_category = 'tools' THEN 'tools_model'
      ELSE NULL
    END
  END
WHERE status IN ('approved', 'active');

-- 显示分类分配结果统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count,
  array_agg(name ORDER BY view_count DESC LIMIT 3) as sample_tools
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;

-- 显示未分类的工具
SELECT 
  COUNT(*) as unclassified_count,
  array_agg(name ORDER BY view_count DESC LIMIT 10) as sample_unclassified
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NULL;
