-- 高级AI语义分析分类脚本
-- 基于深度语义理解和功能特征分析

-- 创建AI语义分析函数
CREATE OR REPLACE FUNCTION analyze_tool_semantics(
  tool_name TEXT,
  tool_tagline TEXT,
  tool_description TEXT,
  tool_tags TEXT[],
  tool_website TEXT
) RETURNS TABLE(
  main_category TEXT,
  sub_category TEXT,
  confidence_score NUMERIC,
  reasoning TEXT
) AS $$
DECLARE
  full_text TEXT;
  intent_vector TEXT;
BEGIN
  -- 构建完整的分析文本
  full_text := COALESCE(tool_name, '') || ' ' || 
               COALESCE(tool_tagline, '') || ' ' || 
               COALESCE(tool_description, '') || ' ' || 
               COALESCE(array_to_string(tool_tags, ' '), '');
  
  -- AI语义分析：基于功能意图和上下文理解
  RETURN QUERY
  WITH semantic_analysis AS (
    SELECT 
      -- 分析核心功能意图
      CASE 
        -- 对话意图：交互式问答和交流
        WHEN (
          full_text ~* '(对话|聊天|问答|交流|communicat|interact|conversation)' AND
          full_text ~* '(智能|AI|artificial|助手|assistant)' AND
          (full_text ~* '(回答|response|解答|solve|help)' OR
           full_text ~* '(多轮|context|memory|上下文)')
        ) THEN ROW('chat', '对话类：基于AI的交互式问答和交流功能', 0.95)
        
        -- 写作意图：内容创作和文本处理
        WHEN (
          full_text ~* '(写作|writing|创作|create|generate|compose)' AND
          (full_text ~* '(文本|text|content|内容|文章)' OR
           full_text ~* '(文案|copy|marketing|内容营销)') AND
          (full_text ~* '(润色|polish|edit|优化|improve)' OR
           full_text ~* '(翻译|translate|translation|多语言|multilingual)')
        ) THEN ROW('writing', '写作类：文本创作、内容生成和语言处理', 0.95)
        
        -- 图像意图：视觉内容创作和处理
        WHEN (
          full_text ~* '(图像|image|picture|photo|视觉|visual)' AND
          (full_text ~* '(生成|generate|create|创作|draw|paint|art)' OR
           full_text ~* '(设计|design|creative|视觉设计)') AND
          (full_text ~* '(AI|artificial|智能|artistic)' OR
           full_text ~* '(编辑|edit|enhance|process|处理)')
        ) THEN ROW('image', '图像类：视觉内容创作、设计和图像处理', 0.95)
        
        -- 视频意图：动态内容创作和处理
        WHEN (
          full_text ~* '(视频|video|movie|animation|动态|motion)' AND
          (full_text ~* '(生成|generate|create|制作|produce)' OR
           full_text ~* '(剪辑|edit|effect|post-production)') AND
          (full_text ~* '(AI|智能|artificial|enhance|enhancement)'
        ) THEN ROW('video', '视频类：动态内容创作、编辑和后期处理', 0.95)
        
        -- 音频意图：声音内容创作和处理
        WHEN (
          full_text ~* '(音频|audio|music|voice|sound|声音|语音)' AND
          (full_text ~* '(生成|generate|create|compose|创作)' OR
           full_text ~* '(合成|synthesis|TTS|speech|语音合成)' OR
           full_text ~* '(转录|transcribe|convert|转换)') AND
          (full_text ~* '(AI|智能|artificial|music|音乐)'
        ) THEN ROW('audio', '音频类：声音内容创作、合成和转录处理', 0.95)
        
        -- 编程意图：软件开发和代码处理
        WHEN (
          full_text ~* '(编程|programming|coding|development|开发)' AND
          (full_text ~* '(代码|code|software|程序|app)' OR
           full_text ~* '(API|interface|framework|library)') AND
          (full_text ~* '(生成|generate|write|create|编写)' OR
           full_text ~* '(测试|test|debug|debugging|调试)'
        ) THEN ROW('coding', '编程类：软件开发、代码生成和技术工具', 0.95)
        
        -- 搜索意图：信息检索和知识发现
        WHEN (
          full_text ~* '(搜索|search|find|discover|检索|research)' AND
          (full_text ~* '(信息|information|data|知识|knowledge)' OR
           full_text ~* '(智能|smart|AI|artificial)') AND
          (full_text ~* '(实时|realtime|online|联网)' OR
           full_text ~* '(学术|academic|study|研究)'
        ) THEN ROW('search', '搜索类：智能信息检索和知识发现', 0.95)
        
        -- 办公意图：工作效率和业务处理
        WHEN (
          full_text ~* '(办公|office|work|business|工作)' AND
          (full_text ~* '(效率|efficiency|productivity|提升)' OR
           full_text ~* '(文档|document|file|数据|data)') AND
          (full_text ~* '(管理|manage|process|处理|自动化)'
        ) THEN ROW('office', '办公类：工作效率提升和业务流程管理', 0.95)
        
        -- 智能体意图：自主智能和工作流
        WHEN (
          full_text ~* '(智能体|agent|bot|robot|机器人)' AND
          (full_text ~* '(自主|autonomous|自动|automation)' OR
           full_text ~* '(任务|task|goal|objective)') AND
          (full_text ~* '(AI|artificial|learning|机器学习)' OR
           full_text ~* '(工作流|workflow|process|流程)'
        ) THEN ROW('ai_agent', '智能类：自主智能体和自动化工作流', 0.95)
        
        -- 工具意图：开发者和基础设施
        ELSE ROW('tools', '工具类：开发者工具和基础设施平台', 0.85)
      END as category_analysis
      
  ),
  subcategory_analysis AS (
    SELECT 
      category_analysis.*,
      -- 子分类语义分析
      CASE category_analysis.main_category
        WHEN 'chat' THEN
          CASE 
            WHEN full_text ~* '(通用|general|多功能|多领域|all-purpose)' THEN 'chat_general'
            WHEN full_text ~* '(专业|professional|领域|domain|法律|medical|finance)' THEN 'chat_professional'
            WHEN full_text ~* '(陪伴|companion|情感|emotional|character|角色)' THEN 'chat_companion'
            WHEN full_text ~* '(多模态|multimodal|视觉|vision|语音|voice|文件|file)' THEN 'chat_multimodal'
            ELSE 'chat_general'
          END
          
        WHEN 'writing' THEN
          CASE 
            WHEN full_text ~* '(营销|marketing|广告|advertising|SEO|文案|copy)' THEN 'writing_marketing'
            WHEN full_text ~* '(学术|academic|论文|paper|研究|research|文献)' THEN 'writing_academic'
            WHEN full_text ~* '(商务|business|办公|office|邮件|email|简历|resume)' THEN 'writing_business'
            WHEN full_text ~* '(翻译|translate|translation|润色|polish|校对|proofread)' THEN 'writing_translation'
            ELSE 'writing_marketing'
          END
          
        WHEN 'image' THEN
          CASE 
            WHEN full_text ~* '(生成|generate|create|绘画|draw|art|创作)' THEN 'image_generation'
            WHEN full_text ~* '(设计|design|logo|UI|poster|海报|建模)' THEN 'image_design'
            WHEN full_text ~* '(编辑|edit|修复|restore|enhance|背景|remove)' THEN 'image_editing'
            WHEN full_text ~* '(识别|recognize|detect|OCR|检测|提取)' THEN 'image_recognition'
            ELSE 'image_generation'
          END
          
        WHEN 'video' THEN
          CASE 
            WHEN full_text ~* '(生成|generate|create|制作|produce|视频|video)' THEN 'video_generation'
            WHEN full_text ~* '(剪辑|edit|cut|effect|特效|subtitle|字幕)' THEN 'video_editing'
            WHEN full_text ~* '(修复|restore|enhance|watermark|水印|画质|quality)' THEN 'video_enhancement'
            ELSE 'video_editing'
          END
          
        WHEN 'audio' THEN
          CASE 
            WHEN full_text ~* '(合成|synthesis|TTS|语音|speech|生成|generate)' THEN 'audio_synthesis'
            WHEN full_text ~* '(音乐|music|compose|作曲|编曲|歌词|lyric)' THEN 'audio_composition'
            WHEN full_text ~* '(转录|transcribe|convert|转换|录音|record)' THEN 'audio_transcription'
            ELSE 'audio_synthesis'
          END
          
        WHEN 'coding' THEN
          CASE 
            WHEN full_text ~* '(生成|generate|create|write|编写|代码|code)' THEN 'coding_generation'
            WHEN full_text ~* '(文档|documentation|comment|API|流程图|flowchart)' THEN 'coding_documentation'
            WHEN full_text ~* '(测试|test|debug|调试|monitor|监控|运维)' THEN 'coding_testing'
            ELSE 'coding_generation'
          END
          
        WHEN 'search' THEN
          CASE 
            WHEN full_text ~* '(智能|smart|AI|联网|realtime|搜索|search)' THEN 'search_smart'
            WHEN full_text ~* '(学术|academic|期刊|journal|文献|literature)' THEN 'search_academic'
            WHEN full_text ~* '(数据|data|市场|market|竞品|analyze|分析)' THEN 'search_research'
            ELSE 'search_smart'
          END
          
        WHEN 'office' THEN
          CASE 
            WHEN full_text ~* '(文档|document|PDF|转换|convert|解析|parse)' THEN 'office_document'
            WHEN full_text ~* '(表格|excel|data|数据|chart|报表|report)' THEN 'office_data'
            WHEN full_text ~* '(PPT|presentation|slide|演示|幻灯片|模板)' THEN 'office_presentation'
            WHEN full_text ~* '(会议|meeting|schedule|日程|task|任务|管理)' THEN 'office_meeting'
            ELSE 'office_document'
          END
          
        WHEN 'ai_agent' THEN
          CASE 
            WHEN full_text ~* '(平台|platform|builder|构建器|coze|dify)' THEN 'ai_platform'
            WHEN full_text ~* '(代理|agent|任务|task|工作流|workflow)' THEN 'ai_agent'
            WHEN full_text ~* '(客服|customer|service|support|机器人)' THEN 'ai_customer_service'
            WHEN full_text ~* '(插件|plugin|extension|GPTs|扩展)' THEN 'ai_plugins'
            ELSE 'ai_platform'
          END
          
        ELSE 'tools_model'
      END as sub_category
      
    FROM semantic_analysis
  )
  SELECT 
    sa.main_category,
    sa.sub_category,
    sa.confidence_score,
    sa.reasoning || ' -> 子分类：' || sa.sub_category as reasoning
  FROM subcategory_analysis sa;
  
END;
$$ LANGUAGE plpgsql;

-- 使用AI语义分析函数批量分类工具
UPDATE tools 
SET main_category = ai.main_category,
    sub_category = ai.sub_category
FROM (
  SELECT 
    t.id,
    (ats.main_category).main_category as main_category,
    (ats.main_category).sub_category as sub_category
  FROM tools t,
  LATERAL analyze_tool_semantics(
    t.name, 
    t.tagline, 
    t.description, 
    t.tags, 
    t.website_url
  ) ats
  WHERE t.status IN ('approved', 'active')
    AND (t.main_category IS NULL OR t.sub_category IS NULL)
) ai
WHERE tools.id = ai.id;

-- 显示AI语义分析结果
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

-- 显示AI分析详情（前10个工具）
SELECT 
  name,
  main_category,
  sub_category,
  (analyze_tool_semantics(name, tagline, description, tags, website_url)).reasoning as ai_reasoning
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
ORDER BY view_count DESC
LIMIT 10;
