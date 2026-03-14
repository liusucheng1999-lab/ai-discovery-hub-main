-- 为现有工具数据分配二级分类
-- 根据工具的现有分类和标签，智能分配到新的二级分类系统

-- 更新工具表，设置主分类和子分类
UPDATE tools SET 
  main_category = CASE 
    -- 💬 对话类
    WHEN category IN ('chat', 'conversation') OR tags && ARRAY['对话', '聊天', 'AI助手', 'ChatGPT', 'Claude'] THEN 'chat'
    
    -- ✍️ 写作类  
    WHEN category IN ('writing', 'content') OR tags && ARRAY['写作', '文案', '翻译', '润色', '论文'] THEN 'writing'
    
    -- 🎨 图像类
    WHEN category IN ('image', 'design', 'art') OR tags && ARRAY['图像', '绘画', '设计', 'AI绘画', 'Midjourney'] THEN 'image'
    
    -- 🎬 视频类
    WHEN category IN ('video', 'animation') OR tags && ARRAY['视频', '剪辑', '动画', '视频生成'] THEN 'video'
    
    -- 🎵 音频类
    WHEN category IN ('audio', 'music', 'voice') OR tags && ARRAY['音频', '音乐', '语音', '配音'] THEN 'audio'
    
    -- 💻 编程类
    WHEN category IN ('coding', 'development', 'dev') OR tags && ARRAY['编程', '代码', '开发', 'API'] THEN 'coding'
    
    -- 🔍 搜索类
    WHEN category IN ('search', 'research') OR tags && ARRAY['搜索', '检索', '调研'] THEN 'search'
    
    -- 📊 办公类
    WHEN category IN ('office', 'productivity', 'business') OR tags && ARRAY['办公', '文档', 'PPT', '表格'] THEN 'office'
    
    -- 🤖 智能类
    WHEN category IN ('agent', 'ai_agent', 'automation') OR tags && ARRAY['智能体', 'Agent', '自动化', '工作流'] THEN 'ai_agent'
    
    -- 🛠️ 工具类
    WHEN category IN ('tools', 'platform', 'framework') OR tags && ARRAY['工具', '平台', '框架', 'API'] THEN 'tools'
    
    ELSE category -- 保持原有分类作为主分类
  END,
  
  sub_category = CASE 
    -- 💬 对话类子分类
    WHEN category IN ('chat', 'conversation') OR tags && ARRAY['对话', '聊天', 'AI助手', 'ChatGPT', 'Claude'] THEN
      CASE 
        WHEN tags && ARRAY['通用', '多模态', '文件分析'] THEN 'chat_multimodal'
        WHEN tags && ARRAY['专业', '法律', '医疗', '金融'] THEN 'chat_professional'  
        WHEN tags && ARRAY['情感', '陪伴', '人设', '虚拟'] THEN 'chat_companion'
        ELSE 'chat_general'
      END
      
    -- ✍️ 写作类子分类
    WHEN category IN ('writing', 'content') OR tags && ARRAY['写作', '文案', '翻译', '润色', '论文'] THEN
      CASE
        WHEN tags && ARRAY['营销', '广告', 'SEO', '小红书'] THEN 'writing_marketing'
        WHEN tags && ARRAY['学术', '论文', '文献', '研究'] THEN 'writing_academic'
        WHEN tags && ARRAY['商务', '办公', '邮件', '简历'] THEN 'writing_business'
        WHEN tags && ARRAY['翻译', '润色', '校对', '语法'] THEN 'writing_translation'
        ELSE 'writing_marketing'
      END
      
    -- 🎨 图像类子分类
    WHEN category IN ('image', 'design', 'art') OR tags && ARRAY['图像', '绘画', '设计', 'AI绘画', 'Midjourney'] THEN
      CASE
        WHEN tags && ARRAY['生成', '绘画', '文生图', 'AI绘画'] THEN 'image_generation'
        WHEN tags && ARRAY['设计', 'Logo', 'UI', '海报'] THEN 'image_design'
        WHEN tags && ARRAY['编辑', '修复', '背景', '放大'] THEN 'image_editing'
        WHEN tags && ARRAY['识别', 'OCR', '检测'] THEN 'image_recognition'
        ELSE 'image_generation'
      END
      
    -- 🎬 视频类子分类
    WHEN category IN ('video', 'animation') OR tags && ARRAY['视频', '剪辑', '动画', '视频生成'] THEN
      CASE
        WHEN tags && ARRAY['生成', '文生视频', '数字人'] THEN 'video_generation'
        WHEN tags && ARRAY['剪辑', '编辑', '特效', '字幕'] THEN 'video_editing'
        WHEN tags && ARRAY['修复', '增强', '水印', '补帧'] THEN 'video_enhancement'
        ELSE 'video_editing'
      END
      
    -- 🎵 音频类子分类
    WHEN category IN ('audio', 'music', 'voice') OR tags && ARRAY['音频', '音乐', '语音', '配音'] THEN
      CASE
        WHEN tags && ARRAY['合成', 'TTS', '语音', '配音'] THEN 'audio_synthesis'
        WHEN tags && ARRAY['音乐', '作曲', '编曲', '歌词'] THEN 'audio_composition'
        WHEN tags && ARRAY['转录', '转文字', '录音', '翻译'] THEN 'audio_transcription'
        ELSE 'audio_synthesis'
      END
      
    -- 💻 编程类子分类
    WHEN category IN ('coding', 'development', 'dev') OR tags && ARRAY['编程', '代码', '开发', 'API'] THEN
      CASE
        WHEN tags && ARRAY['生成', '补全', '纠错', '逻辑'] THEN 'coding_generation'
        WHEN tags && ARRAY['文档', '注释', 'API文档'] THEN 'coding_documentation'
        WHEN tags && ARRAY['测试', '运维', '监控', 'Bug'] THEN 'coding_testing'
        ELSE 'coding_generation'
      END
      
    -- 🔍 搜索类子分类
    WHEN category IN ('search', 'research') OR tags && ARRAY['搜索', '检索', '调研'] THEN
      CASE
        WHEN tags && ARRAY['智能', 'AI搜索', '联网'] THEN 'search_smart'
        WHEN tags && ARRAY['学术', '期刊', '文献', '引用'] THEN 'search_academic'
        WHEN tags && ARRAY['数据', '竞品', '市场', '报告'] THEN 'search_research'
        ELSE 'search_smart'
      END
      
    -- 📊 办公类子分类
    WHEN category IN ('office', 'productivity', 'business') OR tags && ARRAY['办公', '文档', 'PPT', '表格'] THEN
      CASE
        WHEN tags && ARRAY['文档', 'PDF', '总结', '转换'] THEN 'office_document'
        WHEN tags && ARRAY['表格', 'Excel', '数据', '报表'] THEN 'office_data'
        WHEN tags && ARRAY['PPT', '演示', '幻灯片'] THEN 'office_presentation'
        WHEN tags && ARRAY['会议', '日程', '纪要', '任务'] THEN 'office_meeting'
        ELSE 'office_document'
      END
      
    -- 🤖 智能类子分类
    WHEN category IN ('agent', 'ai_agent', 'automation') OR tags && ARRAY['智能体', 'Agent', '自动化', '工作流'] THEN
      CASE
        WHEN tags && ARRAY['平台', '构建器', '扣子', 'Dify'] THEN 'ai_platform'
        WHEN tags && ARRAY['代理', '任务', '工作流'] THEN 'ai_agent'
        WHEN tags && ARRAY['客服', '机器人', '售后'] THEN 'ai_customer_service'
        WHEN tags && ARRAY['插件', 'GPTs', '扩展'] THEN 'ai_plugins'
        ELSE 'ai_platform'
      END
      
    -- 🛠️ 工具类子分类
    WHEN category IN ('tools', 'platform', 'framework') OR tags && ARRAY['工具', '平台', '框架', 'API'] THEN
      CASE
        WHEN tags && ARRAY['模型', 'API', 'Hugging'] THEN 'tools_model'
        WHEN tags && ARRAY['提示', 'Prompt', '词库'] THEN 'tools_prompt'
        WHEN tags && ARRAY['框架', 'LangChain', '部署'] THEN 'tools_framework'
        WHEN tags && ARRAY['检测', '查重', '安全'] THEN 'tools_detection'
        ELSE 'tools_model'
      END
  END
WHERE status IN ('approved', 'active');

-- 显示更新统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, sub_category;
