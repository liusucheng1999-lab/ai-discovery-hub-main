#!/usr/bin/env node

/**
 * AI智能分类系统
 * 先获取工具数据，用AI分析每个工具，然后生成更新SQL
 */

const fs = require('fs');
const path = require('path');

// 模拟AI分类分析函数
function analyzeToolWithAI(tool) {
  const { id, name, tagline, description, tags, website_url, category: oldCategory } = tool;
  
  // 构建分析文本
  const fullText = `${name} ${tagline} ${description} ${tags.join(' ')} ${website_url}`.toLowerCase();
  
  // AI语义分析逻辑
  let mainCategory = null;
  let subCategory = null;
  let reasoning = '';
  let confidence = 0;
  
  // 💬 对话类分析
  if (fullText.includes('chat') || fullText.includes('对话') || fullText.includes('聊天') || 
      fullText.includes('gpt') || fullText.includes('claude') || fullText.includes('gemini') ||
      fullText.includes('assistant') || fullText.includes('问答') || fullText.includes('助手')) {
    
    mainCategory = 'chat';
    confidence = 0.9;
    reasoning = '识别为对话类：基于AI的交互式问答和交流功能';
    
    // 子分类分析
    if (fullText.includes('通用') || fullText.includes('general') || fullText.includes('多模态')) {
      subCategory = 'chat_general';
      reasoning += ' -> 通用对话：支持多领域问答';
    } else if (fullText.includes('专业') || fullText.includes('legal') || fullText.includes('medical')) {
      subCategory = 'chat_professional';
      reasoning += ' -> 专业问答：特定领域的专业咨询';
    } else if (fullText.includes('陪伴') || fullText.includes('情感') || fullText.includes('companion')) {
      subCategory = 'chat_companion';
      reasoning += ' -> 角色陪伴：情感交流和虚拟角色';
    } else if (fullText.includes('多模态') || fullText.includes('vision') || fullText.includes('voice')) {
      subCategory = 'chat_multimodal';
      reasoning += ' -> 多模态：支持图片、语音等多种输入';
    } else {
      subCategory = 'chat_general';
      reasoning += ' -> 通用对话：综合对话功能';
    }
  }
  
  // ✍️ 写作类分析
  else if (fullText.includes('writing') || fullText.includes('写作') || fullText.includes('文案') ||
           fullText.includes('翻译') || fullText.includes('润色') || fullText.includes('论文') ||
           fullText.includes('content') || fullText.includes('article') || fullText.includes('essay')) {
    
    mainCategory = 'writing';
    confidence = 0.9;
    reasoning = '识别为写作类：文本创作、内容生成和语言处理';
    
    if (fullText.includes('营销') || fullText.includes('marketing') || fullText.includes('seo') ||
        fullText.includes('广告') || fullText.includes('copy')) {
      subCategory = 'writing_marketing';
      reasoning += ' -> 文案营销：营销内容创作和SEO优化';
    } else if (fullText.includes('学术') || fullText.includes('academic') || fullText.includes('论文') ||
               fullText.includes('research') || fullText.includes('文献')) {
      subCategory = 'writing_academic';
      reasoning += ' -> 学术科研：论文写作和学术内容';
    } else if (fullText.includes('商务') || fullText.includes('business') || fullText.includes('办公') ||
               fullText.includes('邮件') || fullText.includes('简历')) {
      subCategory = 'writing_business';
      reasoning += ' -> 商务办公：商务文档和办公写作';
    } else if (fullText.includes('翻译') || fullText.includes('translate') || fullText.includes('润色')) {
      subCategory = 'writing_translation';
      reasoning += ' -> 翻译润色：语言翻译和文本优化';
    } else {
      subCategory = 'writing_marketing';
      reasoning += ' -> 文案营销：通用内容创作';
    }
  }
  
  // 🎨 图像类分析
  else if (fullText.includes('image') || fullText.includes('图像') || fullText.includes('绘画') ||
           fullText.includes('design') || fullText.includes('art') || fullText.includes('photo') ||
           fullText.includes('midjourney') || fullText.includes('stable-diffusion')) {
    
    mainCategory = 'image';
    confidence = 0.9;
    reasoning = '识别为图像类：视觉内容创作、设计和图像处理';
    
    if (fullText.includes('生成') || fullText.includes('generate') || fullText.includes('绘画') ||
        fullText.includes('创作') || fullText.includes('art')) {
      subCategory = 'image_generation';
      reasoning += ' -> 绘图生成：AI艺术创作和图像生成';
    } else if (fullText.includes('设计') || fullText.includes('design') || fullText.includes('logo') ||
               fullText.includes('ui') || fullText.includes('poster')) {
      subCategory = 'image_design';
      reasoning += ' -> 设计辅助：视觉设计和创意工具';
    } else if (fullText.includes('编辑') || fullText.includes('edit') || fullText.includes('修复') ||
               fullText.includes('增强') || fullText.includes('background')) {
      subCategory = 'image_editing';
      reasoning += ' -> 图像编辑：图片处理和效果增强';
    } else if (fullText.includes('识别') || fullText.includes('ocr') || fullText.includes('detect')) {
      subCategory = 'image_recognition';
      reasoning += ' -> 识别提取：图像识别和内容提取';
    } else {
      subCategory = 'image_generation';
      reasoning += ' -> 绘图生成：通用图像创作';
    }
  }
  
  // 🎬 视频类分析
  else if (fullText.includes('video') || fullText.includes('视频') || fullText.includes('动画') ||
           fullText.includes('剪辑') || fullText.includes('movie') || fullText.includes('animation')) {
    
    mainCategory = 'video';
    confidence = 0.9;
    reasoning = '识别为视频类：动态内容创作、编辑和后期处理';
    
    if (fullText.includes('生成') || fullText.includes('generate') || fullText.includes('制作')) {
      subCategory = 'video_generation';
      reasoning += ' -> 视频生成：AI视频创作和生成';
    } else if (fullText.includes('剪辑') || fullText.includes('edit') || fullText.includes('特效')) {
      subCategory = 'video_editing';
      reasoning += ' -> 视频剪辑：视频编辑和特效制作';
    } else if (fullText.includes('修复') || fullText.includes('增强') || fullText.includes('水印')) {
      subCategory = 'video_enhancement';
      reasoning += ' -> 画质修复：视频质量提升和修复';
    } else {
      subCategory = 'video_editing';
      reasoning += ' -> 视频剪辑：通用视频处理';
    }
  }
  
  // 🎵 音频类分析
  else if (fullText.includes('audio') || fullText.includes('音乐') || fullText.includes('语音') ||
           fullText.includes('voice') || fullText.includes('sound') || fullText.includes('tts')) {
    
    mainCategory = 'audio';
    confidence = 0.9;
    reasoning = '识别为音频类：声音内容创作、合成和转录处理';
    
    if (fullText.includes('合成') || fullText.includes('tts') || fullText.includes('speech') ||
        fullText.includes('语音') || fullText.includes('配音')) {
      subCategory = 'audio_synthesis';
      reasoning += ' -> 语音合成：文字转语音和声音生成';
    } else if (fullText.includes('音乐') || fullText.includes('music') || fullText.includes('作曲')) {
      subCategory = 'audio_composition';
      reasoning += ' -> 音乐创作：音乐创作和编曲工具';
    } else if (fullText.includes('转录') || fullText.includes('transcribe') || fullText.includes('转换')) {
      subCategory = 'audio_transcription';
      reasoning += ' -> 语音转录：音频转文字和翻译';
    } else {
      subCategory = 'audio_synthesis';
      reasoning += ' -> 语音合成：通用音频处理';
    }
  }
  
  // 💻 编程类分析
  else if (fullText.includes('code') || fullText.includes('编程') || fullText.includes('开发') ||
           fullText.includes('programming') || fullText.includes('api') || fullText.includes('dev')) {
    
    mainCategory = 'coding';
    confidence = 0.9;
    reasoning = '识别为编程类：软件开发、代码生成和技术工具';
    
    if (fullText.includes('生成') || fullText.includes('generate') || fullText.includes('编写')) {
      subCategory = 'coding_generation';
      reasoning += ' -> 代码生成：AI辅助代码编写和生成';
    } else if (fullText.includes('文档') || fullText.includes('documentation') || fullText.includes('api')) {
      subCategory = 'coding_documentation';
      reasoning += ' -> 技术文档：API文档和代码注释生成';
    } else if (fullText.includes('测试') || fullText.includes('test') || fullText.includes('debug')) {
      subCategory = 'coding_testing';
      reasoning += ' -> 测试运维：代码测试和运维工具';
    } else {
      subCategory = 'coding_generation';
      reasoning += ' -> 代码生成：通用编程工具';
    }
  }
  
  // 🔍 搜索类分析
  else if (fullText.includes('search') || fullText.includes('搜索') || fullText.includes('检索') ||
           fullText.includes('research') || fullText.includes('find') || fullText.includes('discover')) {
    
    mainCategory = 'search';
    confidence = 0.9;
    reasoning = '识别为搜索类：智能信息检索和知识发现';
    
    if (fullText.includes('智能') || fullText.includes('ai') || fullText.includes('realtime')) {
      subCategory = 'search_smart';
      reasoning += ' -> 智能搜索：AI驱动的智能搜索';
    } else if (fullText.includes('学术') || fullText.includes('academic') || fullText.includes('期刊')) {
      subCategory = 'search_academic';
      reasoning += ' -> 学术检索：学术文献和研究资料搜索';
    } else if (fullText.includes('数据') || fullText.includes('市场') || fullText.includes('调研')) {
      subCategory = 'search_research';
      reasoning += ' -> 数据调研：市场数据和竞品分析';
    } else {
      subCategory = 'search_smart';
      reasoning += ' -> 智能搜索：通用信息检索';
    }
  }
  
  // 📊 办公类分析
  else if (fullText.includes('office') || fullText.includes('办公') || fullText.includes('文档') ||
           fullText.includes('excel') || fullText.includes('ppt') || fullText.includes('pdf')) {
    
    mainCategory = 'office';
    confidence = 0.9;
    reasoning = '识别为办公类：工作效率提升和业务流程管理';
    
    if (fullText.includes('文档') || fullText.includes('document') || fullText.includes('pdf')) {
      subCategory = 'office_document';
      reasoning += ' -> 文档处理：文档编辑和格式转换';
    } else if (fullText.includes('表格') || fullText.includes('excel') || fullText.includes('数据')) {
      subCategory = 'office_data';
      reasoning += ' -> 表格数据：数据分析和可视化';
    } else if (fullText.includes('ppt') || fullText.includes('presentation') || fullText.includes('演示')) {
      subCategory = 'office_presentation';
      reasoning += ' -> 演示制作：PPT和演示文稿创建';
    } else if (fullText.includes('会议') || fullText.includes('meeting') || fullText.includes('日程')) {
      subCategory = 'office_meeting';
      reasoning += ' -> 会议辅助：会议管理和任务协调';
    } else {
      subCategory = 'office_document';
      reasoning += ' -> 文档处理：通用办公工具';
    }
  }
  
  // 🤖 智能类分析
  else if (fullText.includes('agent') || fullText.includes('智能体') || fullText.includes('机器人') ||
           fullText.includes('automation') || fullText.includes('workflow') || fullText.includes('coze')) {
    
    mainCategory = 'ai_agent';
    confidence = 0.9;
    reasoning = '识别为智能类：自主智能体和自动化工作流';
    
    if (fullText.includes('平台') || fullText.includes('builder') || fullText.includes('dify')) {
      subCategory = 'ai_platform';
      reasoning += ' -> 开发平台：智能体构建和开发平台';
    } else if (fullText.includes('代理') || fullText.includes('任务') || fullText.includes('工作流')) {
      subCategory = 'ai_agent';
      reasoning += ' -> 任务代理：自主任务执行代理';
    } else if (fullText.includes('客服') || fullText.includes('customer') || fullText.includes('服务')) {
      subCategory = 'ai_customer_service';
      reasoning += ' -> 客服系统：智能客服和售后服务';
    } else if (fullText.includes('插件') || fullText.includes('plugin') || fullText.includes('gpts')) {
      subCategory = 'ai_plugins';
      reasoning += ' -> 插件集合：AI插件和扩展工具';
    } else {
      subCategory = 'ai_platform';
      reasoning += ' -> 开发平台：通用智能工具';
    }
  }
  
  // 🛠️ 工具类（默认）
  else {
    mainCategory = 'tools';
    confidence = 0.7;
    reasoning = '识别为工具类：开发者工具和基础设施平台';
    
    if (fullText.includes('模型') || fullText.includes('model') || fullText.includes('api')) {
      subCategory = 'tools_model';
      reasoning += ' -> 模型平台：大模型API和模型市场';
    } else if (fullText.includes('prompt') || fullText.includes('提示') || fullText.includes('词库')) {
      subCategory = 'tools_prompt';
      reasoning += ' -> 提示工程：Prompt优化和词库管理';
    } else if (fullText.includes('framework') || fullText.includes('langchain') || fullText.includes('部署')) {
      subCategory = 'tools_framework';
      reasoning += ' -> 开发框架：AI开发框架和部署工具';
    } else {
      subCategory = 'tools_model';
      reasoning += ' -> 模型平台：通用开发工具';
    }
  }
  
  return {
    id,
    name,
    mainCategory,
    subCategory,
    reasoning,
    confidence,
    oldCategory
  };
}

// 模拟工具数据（实际使用时从数据库获取）
const sampleTools = [
  {
    id: 'tool-1',
    name: 'ChatGPT',
    tagline: 'OpenAI的AI对话助手',
    description: '强大的AI对话助手，支持多轮对话、上下文理解和知识问答',
    tags: ['对话', 'AI助手', 'ChatGPT', '问答'],
    website_url: 'https://chat.openai.com',
    category: 'chat'
  },
  {
    id: 'tool-2', 
    name: 'Midjourney',
    tagline: 'AI艺术创作平台',
    description: '基于AI的图像生成工具，可以根据文字描述创作高质量的艺术作品',
    tags: ['图像', 'AI绘画', '艺术创作', 'Midjourney'],
    website_url: 'https://midjourney.com',
    category: 'image'
  },
  {
    id: 'tool-3',
    name: 'GitHub Copilot',
    tagline: 'AI编程助手',
    description: '智能代码补全工具，帮助开发者提高编程效率',
    tags: ['编程', '代码生成', '开发工具', 'AI助手'],
    website_url: 'https://github.com/features/copilot',
    category: 'coding'
  }
];

// 执行AI分析
console.log('🤖 开始AI智能分类分析...\n');

const results = sampleTools.map(tool => {
  const analysis = analyzeToolWithAI(tool);
  console.log(`📋 工具: ${analysis.name}`);
  console.log(`🎯 主分类: ${analysis.mainCategory} (${(analysis.confidence * 100).toFixed(1)}%)`);
  console.log(`📂 子分类: ${analysis.subCategory}`);
  console.log(`💡 AI推理: ${analysis.reasoning}`);
  console.log('---');
  return analysis;
});

// 生成更新SQL
console.log('\n🚀 生成数据库更新SQL...\n');

const updateSQL = `-- AI智能分类更新SQL
-- 基于深度语义分析的分类结果

UPDATE tools 
SET main_category = CASE id
${results.map(r => `  WHEN '${r.id}' THEN '${r.mainCategory}'`).join('\n')}
END,
sub_category = CASE id
${results.map(r => `  WHEN '${r.id}' THEN '${r.subCategory}'`).join('\n')}
END
WHERE id IN (${results.map(r => `'${r.id}'`).join(', ')});

-- 分类结果统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;

-- AI分析详情
SELECT 
  name,
  main_category,
  sub_category,
  '${results.map(r => `${r.name}: ${r.reasoning}`).join('; ')}' as ai_analysis_summary
FROM tools 
WHERE id IN (${results.map(r => `'${r.id}'`).join(', ')})
ORDER BY view_count DESC;
`;

// 保存SQL文件
fs.writeFileSync(path.join(__dirname, 'ai_categorization_results.sql'), updateSQL);

console.log('✅ AI分析完成！');
console.log(`📊 分析了 ${results.length} 个工具`);
console.log('💾 SQL文件已保存: ai_categorization_results.sql');
console.log('\n📋 分类统计:');
const stats = {};
results.forEach(r => {
  const key = `${r.mainCategory}_${r.subCategory}`;
  stats[key] = (stats[key] || 0) + 1;
});
Object.entries(stats).forEach(([key, count]) => {
  console.log(`  ${key}: ${count} 个工具`);
});
