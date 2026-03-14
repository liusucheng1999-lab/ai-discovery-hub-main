#!/usr/bin/env node

/**
 * AI智能分类工具
 * 基于工具的详细信息进行智能分类判断
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// 分类规则定义
const categoryRules = {
  '💬 对话': {
    main: 'chat',
    subCategories: {
      '通用对话': 'chat_general',
      '专业问答': 'chat_professional', 
      '角色陪伴': 'chat_companion',
      '多模态': 'chat_multimodal'
    },
    keywords: ['对话', '聊天', '问答', '助手', 'assistant', 'chat', 'conversation', 'gpt', 'claude', 'gemini'],
    description: '即时问答、通用助手、交互入口'
  },
  '✍️ 写作': {
    main: 'writing',
    subCategories: {
      '文案营销': 'writing_marketing',
      '学术科研': 'writing_academic',
      '商务办公': 'writing_business',
      '翻译润色': 'writing_translation'
    },
    keywords: ['写作', '文案', '内容', '文章', '论文', '翻译', '润色', 'writing', 'content', 'article'],
    description: '文本生成、创意创作、润色翻译'
  },
  '🎨 图像': {
    main: 'image',
    subCategories: {
      '绘图生成': 'image_generation',
      '设计辅助': 'image_design',
      '图像编辑': 'image_editing',
      '识别提取': 'image_recognition'
    },
    keywords: ['图像', '绘画', '设计', '艺术', '图片', '照片', 'image', 'art', 'design', 'photo'],
    description: '视觉艺术、平面设计、图像处理'
  },
  '🎬 视频': {
    main: 'video',
    subCategories: {
      '视频生成': 'video_generation',
      '视频剪辑': 'video_editing',
      '画质修复': 'video_enhancement'
    },
    keywords: ['视频', '动画', '影片', '剪辑', '制作', 'video', 'animation', 'movie'],
    description: '动态影像生成、剪辑、后期处理'
  },
  '🎵 音频': {
    main: 'audio',
    subCategories: {
      '语音合成': 'audio_synthesis',
      '音乐创作': 'audio_composition',
      '语音转录': 'audio_transcription'
    },
    keywords: ['音频', '音乐', '语音', '配音', '声音', 'audio', 'music', 'voice', 'sound'],
    description: '声音处理、音乐创作、播客录制'
  },
  '💻 编程': {
    main: 'coding',
    subCategories: {
      '代码生成': 'coding_generation',
      '技术文档': 'coding_documentation',
      '测试运维': 'coding_testing'
    },
    keywords: ['编程', '代码', '开发', 'API', 'programming', 'code', 'dev', 'api'],
    description: '代码编写、软件开发、技术文档'
  },
  '🔍 搜索': {
    main: 'search',
    subCategories: {
      '智能搜索': 'search_smart',
      '学术检索': 'search_academic',
      '数据调研': 'search_research'
    },
    keywords: ['搜索', '检索', '调研', '发现', '查找', 'search', 'find', 'research'],
    description: '信息检索、深度调研、知识问答'
  },
  '📊 办公': {
    main: 'office',
    subCategories: {
      '文档处理': 'office_document',
      '表格数据': 'office_data',
      '演示制作': 'office_presentation',
      '会议辅助': 'office_meeting'
    },
    keywords: ['办公', '文档', '表格', 'PPT', 'PDF', 'office', 'document', 'excel', 'ppt'],
    description: '职场生产力、格式转换、多端协作'
  },
  '🤖 智能': {
    main: 'ai_agent',
    subCategories: {
      '开发平台': 'ai_platform',
      '任务代理': 'ai_agent',
      '客服系统': 'ai_customer_service',
      '插件集合': 'ai_plugins'
    },
    keywords: ['智能体', 'Agent', '机器人', '自动化', '工作流', 'agent', 'bot', 'automation'],
    description: '智能体构建、自动化、复杂任务处理'
  },
  '🛠️ 工具': {
    main: 'tools',
    subCategories: {
      '模型平台': 'tools_model',
      '提示工程': 'tools_prompt',
      '开发框架': 'tools_framework',
      '内容检测': 'tools_detection'
    },
    keywords: ['工具', '平台', '框架', '模型', 'tool', 'platform', 'framework', 'model'],
    description: '底层设施、开发者资源、提示工程'
  }
};

/**
 * AI分类判断函数
 */
function analyzeToolCategory(tool) {
  const { name, tagline, description, tags, category: oldCategory } = tool;
  
  // 合并所有文本信息用于分析
  const allText = `${name} ${tagline} ${description} ${tags.join(' ')} ${oldCategory}`.toLowerCase();
  
  // 计算每个分类的匹配分数
  const scores = {};
  
  Object.entries(categoryRules).forEach(([categoryName, rule]) => {
    let score = 0;
    
    // 关键词匹配
    rule.keywords.forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });
    
    // 标签精确匹配
    if (tags && Array.isArray(tags)) {
      tags.forEach(tag => {
        if (rule.keywords.includes(tag.toLowerCase())) {
          score += 20; // 标签匹配权重更高
        }
      });
    }
    
    // 名称匹配
    rule.keywords.forEach(keyword => {
      if (name.toLowerCase().includes(keyword.toLowerCase())) {
        score += 15; // 名称匹配权重较高
      }
    });
    
    // 原有分类匹配
    if (oldCategory && rule.main === oldCategory) {
      score += 5;
    }
    
    scores[categoryName] = score;
  });
  
  // 找到得分最高的分类
  const bestCategory = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  );
  
  const categoryName = bestCategory[0];
  const categoryRule = categoryRules[categoryName];
  
  // 子分类判断
  let bestSubCategory = null;
  let subScore = 0;
  
  Object.entries(categoryRule.subCategories).forEach(([subName, subId]) => {
    let score = 0;
    
    // 基于子分类特征的判断逻辑
    if (categoryName === '💬 对话') {
      if (subName === '通用对话' && (allText.includes('通用') || allText.includes('gpt') || allText.includes('claude'))) score += 10;
      if (subName === '专业问答' && (allText.includes('专业') || allText.includes('法律') || allText.includes('医疗'))) score += 10;
      if (subName === '角色陪伴' && (allText.includes('陪伴') || allText.includes('情感') || allText.includes('虚拟'))) score += 10;
      if (subName === '多模态' && (allText.includes('多模态') || allText.includes('图片') || allText.includes('语音'))) score += 10;
    }
    
    if (categoryName === '✍️ 写作') {
      if (subName === '文案营销' && (allText.includes('营销') || allText.includes('广告') || allText.includes('seo'))) score += 10;
      if (subName === '学术科研' && (allText.includes('学术') || allText.includes('论文') || allText.includes('研究'))) score += 10;
      if (subName === '商务办公' && (allText.includes('商务') || allText.includes('办公') || allText.includes('邮件'))) score += 10;
      if (subName === '翻译润色' && (allText.includes('翻译') || allText.includes('润色') || allText.includes('校对'))) score += 10;
    }
    
    // 其他分类的子分类判断逻辑...
    
    if (score > subScore) {
      subScore = score;
      bestSubCategory = subId;
    }
  });
  
  return {
    main_category: categoryRule.main,
    sub_category: bestSubCategory || Object.values(categoryRule.subCategories)[0], // 默认第一个子分类
    confidence: bestCategory[1],
    reasoning: `匹配${categoryName}，得分${bestCategory[1]}`
  };
}

/**
 * 批量分类工具
 */
async function categorizeTools() {
  try {
    console.log('🔍 开始获取待分类工具...');
    
    // 获取所有未分类的工具
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, tagline, description, category, tags, website_url, view_count, rating, status')
      .in('status', ['approved', 'active'])
      .or('main_category.is.null,sub_category.is.null')
      .order('view_count', { ascending: false });
    
    if (error) {
      console.error('获取工具失败:', error);
      return;
    }
    
    console.log(`📊 找到 ${tools.length} 个待分类工具`);
    
    // 逐个分析分类
    const results = [];
    
    for (const tool of tools) {
      console.log(`\n🔍 分析工具: ${tool.name}`);
      
      const classification = analyzeToolCategory(tool);
      
      console.log(`📋 分类结果: ${classification.main_category} -> ${classification.sub_category}`);
      console.log(`🎯 置信度: ${classification.confidence}`);
      console.log(`💡 理由: ${classification.reasoning}`);
      
      // 更新数据库
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          main_category: classification.main_category,
          sub_category: classification.sub_category
        })
        .eq('id', tool.id);
      
      if (updateError) {
        console.error(`❌ 更新失败 ${tool.name}:`, updateError);
      } else {
        console.log(`✅ 更新成功: ${tool.name}`);
        results.push({
          ...tool,
          ...classification
        });
      }
    }
    
    // 生成分类统计
    console.log('\n📊 分类统计:');
    const stats = {};
    results.forEach(result => {
      const key = `${result.main_category}_${result.sub_category}`;
      stats[key] = (stats[key] || 0) + 1;
    });
    
    Object.entries(stats).forEach(([key, count]) => {
      console.log(`  ${key}: ${count} 个工具`);
    });
    
    console.log(`\n🎉 成功分类 ${results.length} 个工具!`);
    
  } catch (error) {
    console.error('分类过程出错:', error);
  }
}

// 执行分类
if (require.main === module) {
  categorizeTools();
}

module.exports = { analyzeToolCategory, categorizeTools };
