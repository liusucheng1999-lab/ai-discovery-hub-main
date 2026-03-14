-- AI语义分析分类脚本
-- 基于工具功能的深度语义理解进行分类

-- 首先获取工具的完整信息用于AI分析
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
    -- 构建完整的分析文本
    name || ' ' || 
    COALESCE(tagline, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(array_to_string(tags, ' '), '') as full_text
  FROM tools 
  WHERE status IN ('approved', 'active') 
    AND (main_category IS NULL OR sub_category IS NULL)
),

-- AI语义分析分类
ai_classification AS (
  SELECT 
    id,
    full_text,
    name,
    -- 基于语义理解的分类判断
    CASE 
      -- 💬 对话类：基于对话交互的本质特征
      WHEN (
        full_text ~* '(对话|聊天|问答|助手|assistant|chat|conversation|communicat|interact)' AND
        full_text ~* '(智能|AI|artificial|智能体|gpt|claude|gemini)' AND
        (full_text ~* '(回答|response|reply|解答|solve)' OR 
         full_text ~* '(多轮|continuous|context|memory)')
      ) THEN 'chat'
      
      -- ✍️ 写作类：基于内容创作的核心功能
      WHEN (
        full_text ~* '(写作|writing|create|generate|创作|生成)' AND
        (full_text ~* '(文本|text|content|内容|文章|article)' OR
         full_text ~* '(文案|copy|marketing|广告)') AND
        (full_text ~* '(润色|polish|edit|修改|优化)' OR
         full_text ~* '(翻译|translate|translation|多语言)')
      ) THEN 'writing'
      
      -- 🎨 图像类：基于视觉创作和处理
      WHEN (
        full_text ~* '(图像|image|picture|photo|视觉|visual)' AND
        (full_text ~* '(生成|generate|create|创作|draw|paint)' OR
         full_text ~* '(设计|design|logo|ui|海报)') AND
        (full_text ~* '(AI|artificial|智能|art)' OR
         full_text ~* '(编辑|edit|enhance|修复|处理)')
      ) THEN 'image'
      
      -- 🎬 视频类：基于动态影像处理
      WHEN (
        full_text ~* '(视频|video|movie|animation|动态影像)' AND
        (full_text ~* '(生成|generate|create|制作|produce)' OR
         full_text ~* '(剪辑|edit|cut|effect|特效)') AND
        (full_text ~* '(AI|智能|artificial)' OR
         full_text ~* '(处理|process|enhance|修复)')
      ) THEN 'video'
      
      -- 🎵 音频类：基于声音处理和创作
      WHEN (
        full_text ~* '(音频|audio|music|voice|sound|声音|语音)' AND
        (full_text ~* '(生成|generate|create|创作|compose)' OR
         full_text ~* '(合成|synthesis|tts|speech)' OR
         full_text ~* '(转录|transcribe|convert|转换)') AND
        (full_text ~* '(AI|智能|artificial)' OR
         full_text ~* '(音乐|music|语音|voice)')
      ) THEN 'audio'
      
      -- 💻 编程类：基于软件开发相关功能
      WHEN (
        full_text ~* '(编程|programming|code|coding|开发|development)' AND
        (full_text ~* '(代码|code|script|程序|software)' OR
         full_text ~* '(API|接口|framework|框架)') AND
        (full_text ~* '(生成|generate|create|write|编写)' OR
         full_text ~* '(测试|test|debug|debug|调试)')
      ) THEN 'coding'
      
      -- 🔍 搜索类：基于信息检索和发现
      WHEN (
        full_text ~* '(搜索|search|find|discover|检索|调研)' AND
        (full_text ~* '(信息|information|data|数据)' OR
         full_text ~* '(智能|smart|AI|artificial)') AND
        (full_text ~* '(实时|realtime|联网|online)' OR
         full_text ~* '(学术|academic|research|研究)')
      ) THEN 'search'
      
      -- 📊 办公类：基于工作效率提升
      WHEN (
        full_text ~* '(办公|office|work|business|工作)' AND
        (full_text ~* '(文档|document|pdf|word|表格|excel)' OR
         full_text ~* '(效率|efficiency|productivity|提升)') AND
        (full_text ~* '(处理|process|manage|管理)' OR
         full_text ~* '(自动化|automation|智能)')
      ) THEN 'office'
      
      -- 🤖 智能类：基于自主智能体
      WHEN (
        full_text ~* '(智能体|agent|bot|机器人|automation)' AND
        (full_text ~* '(自主|autonomous|自动|workflow|工作流)' OR
         full_text ~* '(任务|task|goal|目标)') AND
        (full_text ~* '(AI|artificial|智能|learning|学习)' OR
         full_text ~* '(平台|platform|构建器|builder)')
      ) THEN 'ai_agent'
      
      -- 🛠️ 工具类：开发者和基础设施工具
      ELSE 'tools'
    END as ai_main_category,
    
    -- AI子分类语义分析
    CASE 
      -- 对话类子分类
      WHEN full_text ~* '(对话|聊天|问答|助手|chat|conversation)' AND
           full_text ~* '(通用|general|多模态|multimodal|文件|file)' THEN 'chat_general'
      WHEN full_text ~* '(专业|professional|法律|legal|医疗|medical|金融|finance)' THEN 'chat_professional'
      WHEN full_text ~* '(陪伴|companion|情感|emotional|角色|character|虚拟)' THEN 'chat_companion'
      WHEN full_text ~* '(多模态|multimodal|视觉|vision|语音|voice|图片|image)' THEN 'chat_multimodal'
      
      -- 写作类子分类
      WHEN full_text ~* '(营销|marketing|广告|ad|SEO|文案|copy)' THEN 'writing_marketing'
      WHEN full_text ~* '(学术|academic|论文|paper|研究|research|文献)' THEN 'writing_academic'
      WHEN full_text ~* '(商务|business|办公|office|邮件|email|简历|resume)' THEN 'writing_business'
      WHEN full_text ~* '(翻译|translate|translation|润色|polish|校对|proofread)' THEN 'writing_translation'
      
      -- 图像类子分类
      WHEN full_text ~* '(生成|generate|create|绘画|draw|art|创作)' THEN 'image_generation'
      WHEN full_text ~* '(设计|design|logo|ui|海报|poster|建模)' THEN 'image_design'
      WHEN full_text ~* '(编辑|edit|修复|restore|增强|enhance|背景|remove)' THEN 'image_editing'
      WHEN full_text ~* '(识别|recognize|detect|OCR|检测|提取)' THEN 'image_recognition'
      
      -- 视频类子分类
      WHEN full_text ~* '(生成|generate|create|制作|produce|视频|video)' THEN 'video_generation'
      WHEN full_text ~* '(剪辑|edit|cut|特效|effect|字幕|subtitle)' THEN 'video_editing'
      WHEN full_text ~* '(修复|restore|增强|enhance|水印|watermark|画质|quality)' THEN 'video_enhancement'
      
      -- 音频类子分类
      WHEN full_text ~* '(合成|synthesis|TTS|语音|speech|生成|generate)' THEN 'audio_synthesis'
      WHEN full_text ~* '(音乐|music|作曲|compose|编曲|歌词|lyric)' THEN 'audio_composition'
      WHEN full_text ~* '(转录|transcribe|转换|convert|录音|record)' THEN 'audio_transcription'
      
      -- 编程类子分类
      WHEN full_text ~* '(生成|generate|create|编写|write|代码|code)' THEN 'coding_generation'
      WHEN full_text ~* '(文档|documentation|注释|comment|API|流程图)' THEN 'coding_documentation'
      WHEN full_text ~* '(测试|test|debug|调试|monitor|监控|运维)' THEN 'coding_testing'
      
      -- 搜索类子分类
      WHEN full_text ~* '(智能|smart|AI|联网|realtime|搜索|search)' THEN 'search_smart'
      WHEN full_text ~* '(学术|academic|期刊|journal|文献|literature)' THEN 'search_academic'
      WHEN full_text ~* '(数据|data|市场|market|竞品|analyze|分析)' THEN 'search_research'
      
      -- 办公类子分类
      WHEN full_text ~* '(文档|document|PDF|转换|convert|解析|parse)' THEN 'office_document'
      WHEN full_text ~* '(表格|excel|data|数据|chart|报表|report)' THEN 'office_data'
      WHEN full_text ~* '(PPT|presentation|演示|slide|模板|template)' THEN 'office_presentation'
      WHEN full_text ~* '(会议|meeting|日程|schedule|任务|task|管理)' THEN 'office_meeting'
      
      -- 智能类子分类
      WHEN full_text ~* '(平台|platform|构建器|builder|coze|dify)' THEN 'ai_platform'
      WHEN full_text ~* '(代理|agent|任务|task|工作流|workflow)' THEN 'ai_agent'
      WHEN full_text ~* '(客服|customer|service|支持|support|机器人)' THEN 'ai_customer_service'
      WHEN full_text ~* '(插件|plugin|extension|GPTs|扩展)' THEN 'ai_plugins'
      
      -- 工具类子分类（默认）
      ELSE 'tools_model'
    END as ai_sub_category
  FROM tool_analysis
)

-- 更新工具分类
UPDATE tools 
SET main_category = ai.ai_main_category,
    sub_category = ai.ai_sub_category
FROM ai_classification ai
WHERE tools.id = ai.id
  AND tools.status IN ('approved', 'active')
  AND (tools.main_category IS NULL OR tools.sub_category IS NULL);

-- 显示AI分类结果
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

-- 显示AI分析未分类的工具
SELECT 
  COUNT(*) as unclassified_count,
  STRING_AGG(name, ', ' ORDER BY view_count DESC LIMIT 10) as sample_unclassified
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NULL;
