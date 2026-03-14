-- AI智能分类脚本 - 基于工具特征的精确分类
-- 执行前请先运行 get_tools_for_ai_categorization.sql 查看待分类工具

-- 智能分类分配 - 基于多维度分析
UPDATE tools SET 
  main_category = 
    CASE 
      -- 💬 对话类分析
      WHEN (
        -- 名称关键词匹配（权重最高）
        LOWER(name) ~ ANY(ARRAY['chat', 'gpt', 'claude', 'gemini', 'kimi', 'dialog', 'conversation', 'assistant', 'ai助手', '聊天', '对话']) OR
        -- 描述关键词匹配
        LOWER(description) ~ ANY(ARRAY['对话', '聊天', '问答', '助手', 'assistant', 'chat', 'conversation', '智能对话']) OR
        -- 标签精确匹配
        tags && ARRAY['对话', '聊天', 'AI助手', 'ChatGPT', 'Claude', 'Gemini', '问答', '智能对话'] OR
        -- 网址特征
        website_url ~ ANY(ARRAY['chatgpt', 'claude', 'gemini', 'openai', 'anthropic']) OR
        -- 原有分类匹配
        category = 'chat'
      ) THEN 'chat'
      
      -- ✍️ 写作类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['write', 'writing', 'essay', 'article', 'content', '文案', '写作', '论文', '翻译', '润色']) OR
        LOWER(description) ~ ANY(ARRAY['写作', '文案', '内容', '文章', '论文', '翻译', '润色', '文档生成', '文本创作']) OR
        tags && ARRAY['写作', '文案', '翻译', '润色', '论文', '内容创作', '文档', '文本'] OR
        website_url ~ ANY(ARRAY['writing', 'content', 'essay', 'article']) OR
        category = 'writing'
      ) THEN 'writing'
      
      -- 🎨 图像类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['image', 'art', 'design', 'draw', 'paint', 'photo', '图像', '绘画', '设计', '艺术', 'ai绘画']) OR
        LOWER(description) ~ ANY(ARRAY['图像', '绘画', '设计', '艺术', 'AI绘画', '图片', '照片', '视觉创作', '图像生成']) OR
        tags && ARRAY['图像', '绘画', '设计', 'AI绘画', 'Midjourney', 'Stable Diffusion', '艺术创作', '视觉', '图片'] OR
        website_url ~ ANY(ARRAY['midjourney', 'stable-diffusion', 'dall-e', 'image', 'art', 'design']) OR
        category = 'image'
      ) THEN 'image'
      
      -- 🎬 视频类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['video', 'movie', 'animation', '视频', '动画', '影片', '剪辑']) OR
        LOWER(description) ~ ANY(ARRAY['视频', '动画', '影片', '剪辑', '制作', '视频生成', '动画制作']) OR
        tags && ARRAY['视频', '动画', '剪辑', '影片制作', '视频编辑', '动画创作'] OR
        website_url ~ ANY(ARRAY['video', 'animation', 'movie', 'clip']) OR
        category = 'video'
      ) THEN 'video'
      
      -- 🎵 音频类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['audio', 'music', 'voice', 'sound', '音频', '音乐', '语音', '声音', '配音']) OR
        LOWER(description) ~ ANY(ARRAY['音频', '音乐', '语音', '配音', '声音', 'TTS', '语音合成', '音乐创作']) OR
        tags && ARRAY['音频', '音乐', '语音', '配音', 'TTS', '声音合成', '音乐制作', '音频编辑'] OR
        website_url ~ ANY(ARRAY['audio', 'music', 'voice', 'sound', 'tts']) OR
        category = 'audio'
      ) THEN 'audio'
      
      -- 💻 编程类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['code', 'programming', 'dev', 'api', '代码', '编程', '开发', '程序员']) OR
        LOWER(description) ~ ANY(ARRAY['编程', '代码', '开发', 'API', '软件开发', '代码生成', '编程助手']) OR
        tags && ARRAY['编程', '代码', '开发', 'API', '软件开发', '程序员', '代码工具'] OR
        website_url ~ ANY(ARRAY['github', 'gitlab', 'code', 'programming', 'dev', 'api']) OR
        category = 'coding'
      ) THEN 'coding'
      
      -- 🔍 搜索类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['search', 'find', 'research', '搜索', '检索', '调研', '发现']) OR
        LOWER(description) ~ ANY(ARRAY['搜索', '检索', '调研', '发现', '查找', '信息检索', '智能搜索']) OR
        tags && ARRAY['搜索', '检索', '调研', '信息检索', '智能搜索', '发现引擎'] OR
        website_url ~ ANY(ARRAY['search', 'google', 'bing', 'research', 'find']) OR
        category = 'search'
      ) THEN 'search'
      
      -- 📊 办公类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['office', 'document', 'excel', 'ppt', 'pdf', '办公', '文档', '表格', '演示']) OR
        LOWER(description) ~ ANY(ARRAY['办公', '文档', '表格', 'PPT', 'PDF', '工作效率', '文档处理', '表格工具']) OR
        tags && ARRAY['办公', '文档', '表格', 'PPT', 'PDF', '工作效率', '文档工具'] OR
        website_url ~ ANY(ARRAY['office', 'document', 'excel', 'powerpoint', 'pdf']) OR
        category = 'office'
      ) THEN 'office'
      
      -- 🤖 智能类分析
      WHEN (
        LOWER(name) ~ ANY(ARRAY['agent', 'bot', 'automation', 'workflow', '智能体', '机器人', '自动化', '工作流']) OR
        LOWER(description) ~ ANY(ARRAY['智能体', 'Agent', '机器人', '自动化', '工作流', 'AI代理', '智能助手']) OR
        tags && ARRAY['智能体', 'Agent', '机器人', '自动化', '工作流', 'AI代理'] OR
        website_url ~ ANY(ARRAY['agent', 'bot', 'automation', 'workflow', 'coze', 'dify']) OR
        category IN ('agent', 'ai_agent')
      ) THEN 'ai_agent'
      
      -- 🛠️ 工具类分析（默认分类）
      ELSE 'tools'
    END,
    
  sub_category = 
    CASE 
      -- 💬 对话类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['chat', 'gpt', 'claude', 'gemini', 'kimi']) OR
        tags && ARRAY['通用', '多模态', '文件分析', 'ChatGPT', 'Claude', 'Gemini'] OR
        website_url ~ ANY(ARRAY['chatgpt', 'claude', 'gemini'])
      ) THEN 'chat_general'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['legal', 'medical', 'finance', 'professional']) OR
        tags && ARRAY['专业', '法律', '医疗', '金融', '咨询'] OR
        LOWER(description) ~ ANY(ARRAY['专业', '法律', '医疗', '金融', '咨询'])
      ) THEN 'chat_professional'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['companion', 'friend', 'emotional', 'character']) OR
        tags && ARRAY['情感', '陪伴', '人设', '虚拟', '角色'] OR
        LOWER(description) ~ ANY(ARRAY['情感', '陪伴', '人设', '虚拟', '角色'])
      ) THEN 'chat_companion'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['multimodal', 'vision', 'voice', 'file']) OR
        tags && ARRAY['多模态', '图片识别', '语音交互', '文件分析'] OR
        LOWER(description) ~ ANY(ARRAY['多模态', '图片识别', '语音交互', '文件分析'])
      ) THEN 'chat_multimodal'
      
      -- ✍️ 写作类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['marketing', 'ad', 'seo', 'copy']) OR
        tags && ARRAY['营销', '广告', 'SEO', '文案', '小红书'] OR
        LOWER(description) ~ ANY(ARRAY['营销', '广告', 'SEO', '文案', '小红书'])
      ) THEN 'writing_marketing'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['academic', 'paper', 'thesis', 'research']) OR
        tags && ARRAY['学术', '论文', '文献', '研究', '开题报告'] OR
        LOWER(description) ~ ANY(ARRAY['学术', '论文', '文献', '研究', '开题报告'])
      ) THEN 'writing_academic'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['business', 'email', 'resume', 'report']) OR
        tags && ARRAY['商务', '办公', '邮件', '简历', '报告', '周报'] OR
        LOWER(description) ~ ANY(ARRAY['商务', '办公', '邮件', '简历', '报告', '周报'])
      ) THEN 'writing_business'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['translate', 'translation', 'proofread']) OR
        tags && ARRAY['翻译', '润色', '校对', '语法', '同声传译'] OR
        LOWER(description) ~ ANY(ARRAY['翻译', '润色', '校对', '语法', '同声传译'])
      ) THEN 'writing_translation'
      
      -- 🎨 图像类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['generate', 'create', 'art', 'paint']) OR
        tags && ARRAY['生成', '绘画', '文生图', 'AI绘画', 'Midjourney', 'Stable Diffusion'] OR
        website_url ~ ANY(ARRAY['midjourney', 'stable-diffusion', 'dall-e'])
      ) THEN 'image_generation'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['design', 'logo', 'ui', 'poster']) OR
        tags && ARRAY['设计', 'Logo', 'UI', '海报', '3D建模'] OR
        LOWER(description) ~ ANY(ARRAY['设计', 'Logo', 'UI', '海报', '3D建模'])
      ) THEN 'image_design'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['edit', 'enhance', 'restore', 'remove']) OR
        tags && ARRAY['编辑', '修复', '背景', '放大', '老照片'] OR
        LOWER(description) ~ ANY(ARRAY['编辑', '修复', '背景', '放大', '老照片'])
      ) THEN 'image_editing'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['ocr', 'recognize', 'detect']) OR
        tags && ARRAY['识别', 'OCR', '检测', '物体识别'] OR
        LOWER(description) ~ ANY(ARRAY['识别', 'OCR', '检测', '物体识别'])
      ) THEN 'image_recognition'
      
      -- 🎬 视频类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['generate', 'create', 'make']) OR
        tags && ARRAY['生成', '文生视频', '数字人', '虚拟人'] OR
        LOWER(description) ~ ANY(ARRAY['生成', '文生视频', '数字人', '虚拟人'])
      ) THEN 'video_generation'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['edit', 'cut', 'effect', 'subtitle']) OR
        tags && ARRAY['剪辑', '编辑', '特效', '字幕', '配音'] OR
        LOWER(description) ~ ANY(ARRAY['剪辑', '编辑', '特效', '字幕', '配音'])
      ) THEN 'video_editing'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['enhance', 'restore', 'watermark']) OR
        tags && ARRAY['修复', '增强', '水印', '补帧', '画质'] OR
        LOWER(description) ~ ANY(ARRAY['修复', '增强', '水印', '补帧', '画质'])
      ) THEN 'video_enhancement'
      
      -- 🎵 音频类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['tts', 'voice', 'speak', 'synthesis']) OR
        tags && ARRAY['合成', 'TTS', '语音', '配音', '克隆'] OR
        website_url ~ ANY(ARRAY['tts', 'voice', 'speech'])
      ) THEN 'audio_synthesis'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['music', 'compose', 'song', 'melody']) OR
        tags && ARRAY['音乐', '作曲', '编曲', '歌词', '伴奏'] OR
        LOWER(description) ~ ANY(ARRAY['音乐', '作曲', '编曲', '歌词', '伴奏'])
      ) THEN 'audio_composition'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['transcribe', 'convert', 'record']) OR
        tags && ARRAY['转录', '转文字', '录音', '翻译', '声纹'] OR
        LOWER(description) ~ ANY(ARRAY['转录', '转文字', '录音', '翻译', '声纹'])
      ) THEN 'audio_transcription'
      
      -- 💻 编程类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['generate', 'complete', 'fix']) OR
        tags && ARRAY['生成', '补全', '纠错', '逻辑', '代码生成'] OR
        LOWER(description) ~ ANY(ARRAY['生成', '补全', '纠错', '逻辑', '代码生成'])
      ) THEN 'coding_generation'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['doc', 'comment', 'api']) OR
        tags && ARRAY['文档', '注释', 'API文档', '流程图'] OR
        LOWER(description) ~ ANY(ARRAY['文档', '注释', 'API文档', '流程图'])
      ) THEN 'coding_documentation'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['test', 'debug', 'monitor']) OR
        tags && ARRAY['测试', '运维', '监控', 'Bug', 'SQL优化'] OR
        LOWER(description) ~ ANY(ARRAY['测试', '运维', '监控', 'Bug', 'SQL优化'])
      ) THEN 'coding_testing'
      
      -- 🔍 搜索类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['smart', 'ai', 'realtime']) OR
        tags && ARRAY['智能', 'AI搜索', '联网', '实时'] OR
        LOWER(description) ~ ANY(ARRAY['智能', 'AI搜索', '联网', '实时'])
      ) THEN 'search_smart'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['academic', 'paper', 'journal']) OR
        tags && ARRAY['学术', '期刊', '文献', '引用', '综述'] OR
        LOWER(description) ~ ANY(ARRAY['学术', '期刊', '文献', '引用', '综述'])
      ) THEN 'search_academic'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['data', 'market', 'analyze']) OR
        tags && ARRAY['数据', '竞品', '市场', '报告', '调研'] OR
        LOWER(description) ~ ANY(ARRAY['数据', '竞品', '市场', '报告', '调研'])
      ) THEN 'search_research'
      
      -- 📊 办公类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['document', 'pdf', 'convert']) OR
        tags && ARRAY['文档', 'PDF', '总结', '转换', '解析'] OR
        LOWER(description) ~ ANY(ARRAY['文档', 'PDF', '总结', '转换', '解析'])
      ) THEN 'office_document'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['excel', 'sheet', 'data', 'chart']) OR
        tags && ARRAY['表格', 'Excel', '数据', '报表', '可视化'] OR
        LOWER(description) ~ ANY(ARRAY['表格', 'Excel', '数据', '报表', '可视化'])
      ) THEN 'office_data'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['ppt', 'presentation', 'slide']) OR
        tags && ARRAY['PPT', '演示', '幻灯片', '模板'] OR
        LOWER(description) ~ ANY(ARRAY['PPT', '演示', '幻灯片', '模板'])
      ) THEN 'office_presentation'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['meeting', 'schedule', 'task']) OR
        tags && ARRAY['会议', '日程', '纪要', '任务', '管理'] OR
        LOWER(description) ~ ANY(ARRAY['会议', '日程', '纪要', '任务', '管理'])
      ) THEN 'office_meeting'
      
      -- 🤖 智能类子分类
      WHEN (
        LOWER(name) ~ ANY(ARRAY['platform', 'builder', 'coze', 'dify']) OR
        tags && ARRAY['平台', '构建器', '扣子', 'Dify', '灵境'] OR
        website_url ~ ANY(ARRAY['coze', 'dify', 'langchain'])
      ) THEN 'ai_platform'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['agent', 'workflow', 'task']) OR
        tags && ARRAY['代理', '任务', '工作流', '自动化'] OR
        LOWER(description) ~ ANY(ARRAY['代理', '任务', '工作流', '自动化'])
      ) THEN 'ai_agent'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['customer', 'service', 'support']) OR
        tags && ARRAY['客服', '机器人', '售后', '服务'] OR
        LOWER(description) ~ ANY(ARRAY['客服', '机器人', '售后', '服务'])
      ) THEN 'ai_customer_service'
      
      WHEN (
        LOWER(name) ~ ANY(ARRAY['plugin', 'extension', 'gpts']) OR
        tags && ARRAY['插件', 'GPTs', '扩展', '商店'] OR
        LOWER(description) ~ ANY(ARRAY['插件', 'GPTs', '扩展', '商店'])
      ) THEN 'ai_plugins'
      
      -- 🛠️ 工具类子分类（默认）
      ELSE 'tools_model'
    END
WHERE status IN ('approved', 'active') 
  AND (main_category IS NULL OR sub_category IS NULL);

-- 显示分类结果统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count,
  STRING_AGG(name, ', ' ORDER BY view_count DESC LIMIT 3) as sample_tools
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;

-- 显示未分类的工具
SELECT 
  COUNT(*) as unclassified_count,
  STRING_AGG(name, ', ' ORDER BY view_count DESC LIMIT 10) as sample_unclassified
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NULL;
