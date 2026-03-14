-- 真正的AI智能分类脚本
-- 基于深度语义理解，先分析后更新

-- 第一步：获取所有待分类工具进行AI分析
WITH tool_analysis AS (
  SELECT 
    id,
    name,
    tagline,
    description,
    category as old_category,
    tags,
    website_url,
    view_count,
    -- 构建AI分析文本
    LOWER(name || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(array_to_string(tags, ' '), '') || ' ' || COALESCE(website_url, '')) as analysis_text
  FROM tools 
  WHERE status IN ('approved', 'active') 
    AND (main_category IS NULL OR sub_category IS NULL)
),

-- AI语义分析分类
ai_classification AS (
  SELECT 
    id,
    name,
    analysis_text,
    -- 基于深度语义理解的主分类判断
    CASE 
      -- 💬 对话类：交互式AI助手特征
      WHEN (
        analysis_text ~ '(chat|对话|聊天|conversation|assistant|助手|问答|gpt|claude|gemini)' AND
        analysis_text ~ '(ai|智能|artificial|智能体|多轮|context|上下文|memory|回答|response)'
      ) THEN 'chat'
      
      -- ✍️ 写作类：内容创作和文本处理特征
      WHEN (
        analysis_text ~ '(writing|写作|content|内容|article|文章|essay|论文|创作|generate|生成)' AND
        (analysis_text ~ '(text|文本|copy|文案|marketing|营销|translation|翻译|polish|润色)' OR
         analysis_text ~ '(academic|学术|research|研究|business|商务|office|办公)')
      ) THEN 'writing'
      
      -- 🎨 图像类：视觉内容创作和处理特征
      WHEN (
        analysis_text ~ '(image|图像|picture|图片|photo|照片|visual|视觉|art|艺术|design|设计)' AND
        (analysis_text ~ '(generate|生成|create|创作|draw|绘画|paint|ai绘画)' OR
         analysis_text ~ '(edit|编辑|enhance|增强|process|处理|design|设计)')
      ) THEN 'image'
      
      -- 🎬 视频类：动态内容创作和处理特征
      WHEN (
        analysis_text ~ '(video|视频|movie|影片|animation|动画|motion|动态)' AND
        (analysis_text ~ '(generate|生成|create|制作|produce|创作)' OR
         analysis_text ~ '(edit|剪辑|cut|effect|特效|subtitle|字幕|post|后期)')
      ) THEN 'video'
      
      -- 🎵 音频类：声音内容创作和处理特征
      WHEN (
        analysis_text ~ '(audio|音频|music|音乐|voice|语音|sound|声音|tts|speech)' AND
        (analysis_text ~ '(generate|生成|create|创作|compose|作曲|synthesis|合成)' OR
         analysis_text ~ '(transcribe|转录|convert|转换|translate|翻译)')
      ) THEN 'audio'
      
      -- 💻 编程类：软件开发相关特征
      WHEN (
        analysis_text ~ '(code|代码|programming|编程|development|开发|dev|api|framework|框架)' AND
        (analysis_text ~ '(generate|生成|create|write|编写|complete|补全)' OR
         analysis_text ~ '(test|测试|debug|调试|document|文档|comment|注释)')
      ) THEN 'coding'
      
      -- 🔍 搜索类：信息检索和发现特征
      WHEN (
        analysis_text ~ '(search|搜索|find|查找|discover|发现|research|调研|retrieval|检索)' AND
        (analysis_text ~ '(smart|智能|ai|artificial|realtime|实时|online|联网)' OR
         analysis_text ~ '(academic|学术|study|学习|knowledge|知识)')
      ) THEN 'search'
      
      -- 📊 办公类：工作效率和业务处理特征
      WHEN (
        analysis_text ~ '(office|办公|work|工作|business|商务|productivity|效率)' AND
        (analysis_text ~ '(document|文档|pdf|excel|表格|ppt|演示|presentation|slide|幻灯片)' OR
         analysis_text ~ '(manage|管理|process|处理|workflow|工作流|automation|自动化)')
      ) THEN 'office'
      
      -- 🤖 资源类：AI构建平台和资源站点
      WHEN (
        analysis_text ~ '(platform|平台|builder|构建器|coze|dify|langchain|flowise)' OR
        analysis_text ~ '(plugin|插件|extension|扩展|gpts|store|商店|marketplace)' OR
        analysis_text ~ '(navigation|导航|community|社区|model|模型|news|资讯|aggregate|聚合)'
      ) THEN 'ai_agent'
      
      -- 🛠️ 工具类：开发者和基础设施特征
      ELSE 'tools'
    END as ai_main_category,
    
    -- AI子分类语义分析
    CASE 
      -- 💬 对话类子分类
      WHEN (
        analysis_text ~ '(chat|对话|聊天|gpt|claude|gemini|通用|general)' AND
        analysis_text ~ '(assistant|助手|ai|智能|多功能|多领域)'
      ) THEN 'chat_general'
      WHEN (
        analysis_text ~ '(professional|专业|legal|法律|medical|医疗|finance|金融|consulting|咨询)'
      ) THEN 'chat_professional'
      WHEN (
        analysis_text ~ '(companion|陪伴|emotional|情感|character|角色|virtual|虚拟)'
      ) THEN 'chat_companion'
      WHEN (
        analysis_text ~ '(multimodal|多模态|vision|视觉|voice|语音|file|文件|image|图片)'
      ) THEN 'chat_multimodal'
      
      -- ✍️ 写作类子分类
      WHEN (
        analysis_text ~ '(marketing|营销|advertising|广告|seo|copy|文案|小红书)'
      ) THEN 'writing_marketing'
      WHEN (
        analysis_text ~ '(academic|学术|paper|论文|research|研究|thesis|文献|study)'
      ) THEN 'writing_academic'
      WHEN (
        analysis_text ~ '(business|商务|office|办公|email|邮件|resume|简历|report|报告)'
      ) THEN 'writing_business'
      WHEN (
        analysis_text ~ '(translation|翻译|translate|polish|润色|proofread|校对|grammar|语法)'
      ) THEN 'writing_translation'
      
      -- 🎨 图像类子分类
      WHEN (
        analysis_text ~ '(generate|生成|create|创作|draw|绘画|art|ai绘画|midjourney|stable-diffusion)'
      ) THEN 'image_generation'
      WHEN (
        analysis_text ~ '(design|设计|logo|ui|poster|海报|3d|建模|modeling)'
      ) THEN 'image_design'
      WHEN (
        analysis_text ~ '(edit|编辑|enhance|增强|restore|修复|background|背景|remove|去除)'
      ) THEN 'image_editing'
      WHEN (
        analysis_text ~ '(recognize|识别|ocr|detect|检测|extract|提取|object|物体)'
      ) THEN 'image_recognition'
      
      -- 🎬 视频类子分类
      WHEN (
        analysis_text ~ '(generate|生成|create|制作|produce|video|视频|digital|数字人|avatar)'
      ) THEN 'video_generation'
      WHEN (
        analysis_text ~ '(edit|剪辑|cut|effect|特效|subtitle|字幕|voiceover|配音)'
      ) THEN 'video_editing'
      WHEN (
        analysis_text ~ '(enhance|增强|restore|修复|watermark|水印|quality|画质|frame|补帧)'
      ) THEN 'video_enhancement'
      
      -- 🎵 音频类子分类
      WHEN (
        analysis_text ~ '(synthesis|合成|tts|text-to-speech|语音|voice|clone|克隆)'
      ) THEN 'audio_synthesis'
      WHEN (
        analysis_text ~ '(music|音乐|compose|作曲|arrange|编曲|lyric|歌词|accompaniment|伴奏)'
      ) THEN 'audio_composition'
      WHEN (
        analysis_text ~ '(transcribe|转录|convert|转换|record|录音|translate|翻译|fingerprint|声纹)'
      ) THEN 'audio_transcription'
      
      -- 💻 编程类子分类
      WHEN (
        analysis_text ~ '(generate|生成|create|write|编写|complete|补全|logic|逻辑)'
      ) THEN 'coding_generation'
      WHEN (
        analysis_text ~ '(documentation|文档|comment|注释|api|flowchart|流程图)'
      ) THEN 'coding_documentation'
      WHEN (
        analysis_text ~ '(test|测试|debug|调试|monitor|监控|operation|运维|sql|bug)'
      ) THEN 'coding_testing'
      
      -- 🔍 搜索类子分类
      WHEN (
        analysis_text ~ '(smart|智能|ai|realtime|实时|online|联网|search|搜索)'
      ) THEN 'search_smart'
      WHEN (
        analysis_text ~ '(academic|学术|journal|期刊|paper|论文|citation|引用|literature|文献)'
      ) THEN 'search_academic'
      WHEN (
        analysis_text ~ '(data|数据|market|市场|competitor|竞品|analyze|分析|report|报告)'
      ) THEN 'search_research'
      
      -- 📊 办公类子分类
      WHEN (
        analysis_text ~ '(document|文档|pdf|convert|转换|parse|解析|summary|总结)'
      ) THEN 'office_document'
      WHEN (
        analysis_text ~ '(excel|表格|data|数据|chart|图表|visualization|可视化|report|报表)'
      ) THEN 'office_data'
      WHEN (
        analysis_text ~ '(ppt|presentation|slide|演示|幻灯片|template|模板)'
      ) THEN 'office_presentation'
      WHEN (
        analysis_text ~ '(meeting|会议|schedule|日程|task|任务|management|管理|minute|纪要)'
      ) THEN 'office_meeting'
      
      -- 🤖 资源类子分类
      WHEN (
        analysis_text ~ '(platform|平台|builder|构建器|coze|dify|灵境|langchain|flowise)'
      ) THEN 'ai_platform'
      WHEN (
        analysis_text ~ '(plugin|插件|extension|扩展|gpts|store|商店|marketplace|app|应用)'
      ) THEN 'ai_plugins'
      WHEN (
        analysis_text ~ '(navigation|导航|community|社区|model|模型|news|资讯|aggregate|聚合|directory|目录)'
      ) THEN 'ai_other'
      
      -- 🛠️ 工具类子分类（默认）
      ELSE 'tools_model'
    END as ai_sub_category
  FROM tool_analysis
)

-- 第二步：根据AI分析结果更新工具分类
UPDATE tools 
SET main_category = ai.ai_main_category,
    sub_category = ai.ai_sub_category
FROM ai_classification ai
WHERE tools.id = ai.id
  AND tools.status IN ('approved', 'active')
  AND (tools.main_category IS NULL OR tools.sub_category IS NULL);

-- 第三步：显示AI分类结果统计
SELECT 
  ai_main_category as main_category,
  ai_sub_category as sub_category,
  COUNT(*) as tool_count,
  STRING_AGG(name, ', ' ORDER BY view_count DESC LIMIT 3) as sample_tools,
  STRING_AGG('AI分析: ' || name || ' -> ' || ai_main_category || '/' || ai_sub_category, '; ' ORDER BY view_count DESC LIMIT 5) as ai_analysis_samples
FROM ai_classification
GROUP BY ai_main_category, ai_sub_category
ORDER BY ai_main_category, tool_count DESC;

-- 第四步：显示AI分析详情（前20个工具）
SELECT 
  name,
  old_category,
  ai_main_category as new_main_category,
  ai_sub_category as new_sub_category,
  view_count,
  CASE ai_main_category
    WHEN 'chat' THEN '💬 对话'
    WHEN 'writing' THEN '✍️ 写作'
    WHEN 'image' THEN '🎨 图像'
    WHEN 'video' THEN '🎬 视频'
    WHEN 'audio' THEN '🎵 音频'
    WHEN 'coding' THEN '💻 编程'
    WHEN 'search' THEN '🔍 搜索'
    WHEN 'office' THEN '📊 办公'
    WHEN 'ai_agent' THEN '🤖 资源'
    WHEN 'tools' THEN '🛠️ 工具'
  END as category_emoji
FROM ai_classification
ORDER BY view_count DESC
LIMIT 20;

-- 第五步：显示分类完成度
SELECT 
  COUNT(*) as total_tools_analyzed,
  COUNT(DISTINCT ai_main_category) as categories_used,
  COUNT(DISTINCT ai_sub_category) as subcategories_used,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tools WHERE status IN ('approved', 'active')), 2) as completion_percentage
FROM ai_classification;
