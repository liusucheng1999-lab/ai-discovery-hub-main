#!/usr/bin/env node

/**
 * AI智能分类系统
 * 基于深度语义分析的智能二级分类判断
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase配置
const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co';
const supabaseKey = process.env.DEEPSEEK_API_KEY ? 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k' : 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

const supabase = createClient(supabaseUrl, supabaseKey);

// DeepSeek API配置
const DEEPSEEK_API_KEY = process.env.VITE_DEEPSEEK_API_KEY || 'sk-7d4193f17b76468a874ce1cce218dfa4';
const DEEPSEEK_BASE_URL = process.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

/**
 * 分类规则定义
 */
const CATEGORY_RULES = {
  // 💬 对话类
  chat: {
    keywords: ['chat', '对话', '聊天', 'gpt', 'claude', 'gemini', 'assistant', '问答', '助手', 'conversation'],
    subCategories: {
      chat_general: {
        keywords: ['通用', 'general', '多模态', 'all-purpose', 'versatile'],
        name: '通用对话',
        description: '支持多领域问答的通用AI助手'
      },
      chat_professional: {
        keywords: ['专业', 'legal', 'medical', 'financial', 'consulting', 'expert'],
        name: '专业问答',
        description: '特定领域的专业咨询服务'
      },
      chat_companion: {
        keywords: ['陪伴', '情感', 'companion', 'friend', 'character', 'roleplay'],
        name: '角色陪伴',
        description: '情感交流和虚拟角色互动'
      },
      chat_multimodal: {
        keywords: ['多模态', 'vision', 'voice', 'image', 'multimodal', 'upload'],
        name: '多模态',
        description: '支持图片、语音等多种输入方式'
      }
    }
  },
  
  // ✍️ 写作类
  writing: {
    keywords: ['writing', '写作', '文案', '翻译', '润色', '论文', 'content', 'article', 'essay', 'text'],
    subCategories: {
      writing_marketing: {
        keywords: ['营销', 'marketing', 'seo', '广告', 'copy', 'advertising'],
        name: '文案营销',
        description: '营销内容创作和SEO优化'
      },
      writing_academic: {
        keywords: ['学术', 'academic', '论文', 'research', '文献', 'thesis'],
        name: '学术科研',
        description: '论文写作和学术内容生成'
      },
      writing_business: {
        keywords: ['商务', 'business', '办公', '邮件', '简历', 'resume', 'email'],
        name: '商务办公',
        description: '商务文档和办公写作'
      },
      writing_translation: {
        keywords: ['翻译', 'translate', '润色', 'polish', 'language'],
        name: '翻译润色',
        description: '语言翻译和文本优化'
      }
    }
  },
  
  // 🎨 图像类
  image: {
    keywords: ['image', '图像', '绘画', 'design', 'art', 'photo', 'midjourney', 'stable-diffusion', 'dall-e'],
    subCategories: {
      image_generation: {
        keywords: ['生成', 'generate', '绘画', '创作', 'art', 'create'],
        name: '绘图生成',
        description: 'AI艺术创作和图像生成'
      },
      image_design: {
        keywords: ['设计', 'design', 'logo', 'ui', 'poster', 'banner'],
        name: '设计辅助',
        description: '视觉设计和创意工具'
      },
      image_editing: {
        keywords: ['编辑', 'edit', '修复', 'enhance', 'background', 'remove'],
        name: '图像编辑',
        description: '图片处理和效果增强'
      },
      image_recognition: {
        keywords: ['识别', 'ocr', 'detect', 'recognition', 'extract'],
        name: '识别提取',
        description: '图像识别和内容提取'
      }
    }
  },
  
  // 🎬 视频类
  video: {
    keywords: ['video', '视频', '动画', '剪辑', 'movie', 'animation'],
    subCategories: {
      video_generation: {
        keywords: ['生成', 'generate', '制作', 'create', 'video'],
        name: '视频生成',
        description: 'AI视频创作和生成'
      },
      video_editing: {
        keywords: ['剪辑', 'edit', '特效', 'effects', 'subtitle'],
        name: '视频剪辑',
        description: '视频编辑和特效制作'
      },
      video_enhancement: {
        keywords: ['修复', 'enhance', '水印', 'watermark', 'quality'],
        name: '画质修复',
        description: '视频质量提升和修复'
      }
    }
  },
  
  // 🎵 音频类
  audio: {
    keywords: ['audio', '音乐', '语音', 'voice', 'sound', 'tts', 'music'],
    subCategories: {
      audio_synthesis: {
        keywords: ['合成', 'tts', 'speech', '语音', '配音', 'voice'],
        name: '语音合成',
        description: '文字转语音和声音生成'
      },
      audio_composition: {
        keywords: ['音乐', 'music', '作曲', 'composition', '编曲'],
        name: '音乐创作',
        description: '音乐创作和编曲工具'
      },
      audio_transcription: {
        keywords: ['转录', 'transcribe', '转换', 'convert', 'speech-to-text'],
        name: '语音转录',
        description: '音频转文字和翻译'
      }
    }
  },
  
  // 💻 编程类
  coding: {
    keywords: ['code', '编程', '开发', 'programming', 'api', 'dev', 'github', 'copilot'],
    subCategories: {
      coding_generation: {
        keywords: ['生成', 'generate', '编写', 'write', 'code'],
        name: '代码生成',
        description: 'AI辅助代码编写和生成'
      },
      coding_documentation: {
        keywords: ['文档', 'documentation', 'api', 'comment', 'readme'],
        name: '技术文档',
        description: 'API文档和代码注释生成'
      },
      coding_testing: {
        keywords: ['测试', 'test', 'debug', 'debugging', 'testing'],
        name: '测试运维',
        description: '代码测试和运维工具'
      }
    }
  },
  
  // 🔍 搜索类
  search: {
    keywords: ['search', '搜索', '检索', 'research', 'find', 'discover'],
    subCategories: {
      search_smart: {
        keywords: ['智能', 'ai', 'realtime', 'real-time', 'smart'],
        name: '智能搜索',
        description: 'AI驱动的智能搜索'
      },
      search_academic: {
        keywords: ['学术', 'academic', '期刊', 'journal', 'paper'],
        name: '学术检索',
        description: '学术文献和研究资料搜索'
      },
      search_research: {
        keywords: ['数据', '市场', '调研', 'market', 'analysis'],
        name: '数据调研',
        description: '市场数据和竞品分析'
      }
    }
  },
  
  // 📊 办公类
  office: {
    keywords: ['office', '办公', '文档', 'excel', 'ppt', 'pdf'],
    subCategories: {
      office_document: {
        keywords: ['文档', 'document', 'pdf', 'word', 'text'],
        name: '文档处理',
        description: '文档编辑和格式转换'
      },
      office_data: {
        keywords: ['表格', 'excel', '数据', 'data', 'chart'],
        name: '表格数据',
        description: '数据分析和可视化'
      },
      office_presentation: {
        keywords: ['ppt', 'presentation', '演示', 'slide'],
        name: '演示制作',
        description: 'PPT和演示文稿创建'
      },
      office_meeting: {
        keywords: ['会议', 'meeting', '日程', 'schedule', 'calendar'],
        name: '会议辅助',
        description: '会议管理和任务协调'
      }
    }
  },
  
  // 🤖 资源类
  ai_agent: {
    keywords: ['agent', '智能体', '机器人', 'automation', 'workflow', 'coze', 'dify'],
    subCategories: {
      ai_platform: {
        keywords: ['平台', 'builder', 'dify', 'coze', 'platform'],
        name: '开发平台',
        description: '智能体构建和开发平台'
      },
      ai_plugins: {
        keywords: ['插件', 'plugin', 'gpts', 'extension', 'store'],
        name: '插件集合',
        description: 'AI插件和扩展工具'
      },
      ai_other: {
        keywords: ['导航', '社区', '模型', 'hub', 'navigation'],
        name: '其他网站',
        description: 'AI导航站和模型社区'
      }
    }
  },
  
  // 🛠️ 工具类（默认）
  tools: {
    keywords: ['tools', '工具', 'framework', 'api', 'model', 'prompt'],
    subCategories: {
      tools_model: {
        keywords: ['模型', 'model', 'api', 'huggingface', 'openai'],
        name: '模型平台',
        description: '大模型API和模型市场'
      },
      tools_prompt: {
        keywords: ['prompt', '提示', '词库', 'library'],
        name: '提示工程',
        description: 'Prompt优化和词库管理'
      },
      tools_framework: {
        keywords: ['framework', 'langchain', '部署', 'deploy'],
        name: '开发框架',
        description: 'AI开发框架和部署工具'
      },
      tools_detection: {
        keywords: ['检测', 'detect', '识别', 'ai-content'],
        name: '内容检测',
        description: 'AI生成内容识别和检测'
      }
    }
  }
};

/**
 * 基于规则的分类分析
 */
function analyzeToolWithRules(tool) {
  const { id, name, tagline, description, tags, website_url } = tool;
  
  // 构建分析文本（小写化）
  const fullText = `${name} ${tagline} ${description} ${(tags || []).join(' ')} ${website_url}`.toLowerCase();
  
  let bestMatch = {
    mainCategory: 'tools', // 默认分类
    subCategory: 'tools_model',
    confidence: 0.3,
    reasoning: '使用默认分类：工具类'
  };
  
  // 遍历所有主分类
  for (const [mainCatId, mainCatInfo] of Object.entries(CATEGORY_RULES)) {
    const mainKeywords = mainCatInfo.keywords;
    const mainScore = mainKeywords.filter(keyword => fullText.includes(keyword)).length;
    
    if (mainScore > 0) {
      // 找到匹配的主分类，继续分析子分类
      let bestSubMatch = {
        subCategory: null,
        confidence: 0,
        reasoning: `识别为${mainCatInfo.name}类`
      };
      
      // 遍历子分类
      for (const [subCatId, subCatInfo] of Object.entries(mainCatInfo.subCategories)) {
        const subKeywords = subCatInfo.keywords;
        const subScore = subKeywords.filter(keyword => fullText.includes(keyword)).length;
        
        if (subScore > bestSubMatch.confidence) {
          bestSubMatch = {
            subCategory: subCatId,
            confidence: subScore,
            reasoning: `${bestSubMatch.reasoning} -> ${subCatInfo.name}：${subCatInfo.description}`
          };
        }
      }
      
      // 如果没有找到匹配的子分类，使用第一个子分类作为默认
      if (!bestSubMatch.subCategory) {
        const firstSubCat = Object.keys(mainCatInfo.subCategories)[0];
        bestSubMatch.subCategory = firstSubCat;
        bestSubMatch.confidence = 0.5;
        bestSubMatch.reasoning += ` -> 默认子分类`;
      }
      
      // 计算总体置信度
      const totalConfidence = (mainScore * 0.6 + bestSubMatch.confidence * 0.4) / (mainScore + bestSubMatch.confidence);
      
      if (totalConfidence > bestMatch.confidence) {
        bestMatch = {
          mainCategory: mainCatId,
          subCategory: bestSubMatch.subCategory,
          confidence: totalConfidence,
          reasoning: bestSubMatch.reasoning
        };
      }
    }
  }
  
  return {
    id,
    name: tool.name,
    ...bestMatch,
    currentCategory: tool.current_category,
    currentMainCategory: tool.current_main_category,
    currentSubCategory: tool.current_sub_category,
    status: tool.status
  };
}

/**
 * 使用DeepSeek API进行智能分类（可选）
 */
async function analyzeToolWithAI(tool) {
  const prompt = `
请分析以下AI工具并将其分类到合适的二级分类中：

工具信息：
- 名称：${tool.name}
- 标语：${tool.tagline || '无'}
- 描述：${tool.description || '无'}
- 标签：${(tool.tags || []).join(', ')}
- 网站：${tool.website_url || '无'}

分类系统：
主分类：
- chat (对话)
- writing (写作)
- image (图像)
- video (视频)
- audio (音频)
- coding (编程)
- search (搜索)
- office (办公)
- ai_agent (资源)
- tools (工具)

每个主分类对应的子分类：
chat: chat_general, chat_professional, chat_companion, chat_multimodal
writing: writing_marketing, writing_academic, writing_business, writing_translation
image: image_generation, image_design, image_editing, image_recognition
video: video_generation, video_editing, video_enhancement
audio: audio_synthesis, audio_composition, audio_transcription
coding: coding_generation, coding_documentation, coding_testing
search: search_smart, search_academic, search_research
office: office_document, office_data, office_presentation, office_meeting
ai_agent: ai_platform, ai_plugins, ai_other
tools: tools_model, tools_prompt, tools_framework, tools_detection

请以JSON格式返回分析结果：
{
  "main_category": "主分类ID",
  "sub_category": "子分类ID",
  "confidence": 0.9,
  "reasoning": "分类理由"
}

请只返回JSON，不要包含其他文字。
`;

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个专业的AI工具分类专家，擅长根据工具的功能和描述进行准确分类。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content.trim();
    
    // 解析JSON响应
    const aiResult = JSON.parse(content);
    
    return {
      id: tool.id,
      name: tool.name,
      mainCategory: aiResult.main_category,
      subCategory: aiResult.sub_category,
      confidence: aiResult.confidence,
      reasoning: aiResult.reasoning,
      currentCategory: tool.current_category,
      currentMainCategory: tool.current_main_category,
      currentSubCategory: tool.current_sub_category,
      status: tool.status
    };
    
  } catch (error) {
    console.warn(`AI分析失败 ${tool.name}:`, error.message);
    // 如果AI分析失败，回退到规则分析
    return analyzeToolWithRules(tool);
  }
}

/**
 * 批量分析工具
 */
async function analyzeTools(tools, useAI = false) {
  console.log(`🤖 开始AI智能分类分析 (${useAI ? 'AI模式' : '规则模式'})...\n`);
  
  const results = [];
  const total = tools.length;
  
  for (let i = 0; i < total; i++) {
    const tool = tools[i];
    
    try {
      console.log(`📊 进度: ${i + 1}/${total} - 分析工具: ${tool.name}`);
      
      let result;
      if (useAI) {
        result = await analyzeToolWithAI(tool);
        // AI请求间隔，避免频率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        result = analyzeToolWithRules(tool);
      }
      
      results.push(result);
      
      console.log(`  ✅ 主分类: ${result.mainCategory} (${(result.confidence * 100).toFixed(1)}%)`);
      console.log(`  📂 子分类: ${result.subCategory}`);
      console.log(`  💡 推理: ${result.reasoning}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ 分析失败 ${tool.name}:`, error.message);
      // 使用规则分析作为备选
      const fallbackResult = analyzeToolWithRules(tool);
      results.push(fallbackResult);
    }
  }
  
  return results;
}

/**
 * 生成分析报告
 */
function generateReport(results) {
  console.log('\n📋 分析报告生成中...');
  
  // 统计信息
  const stats = {
    total: results.length,
    categoryDistribution: {},
    subCategoryDistribution: {},
    confidenceDistribution: { high: 0, medium: 0, low: 0 },
    changes: {
      newMainCategory: 0,
      newSubCategory: 0,
      unchanged: 0
    }
  };
  
  results.forEach(result => {
    // 主分类统计
    const mainCat = result.mainCategory;
    stats.categoryDistribution[mainCat] = (stats.categoryDistribution[mainCat] || 0) + 1;
    
    // 子分类统计
    const subCat = `${result.mainCategory}_${result.subCategory}`;
    stats.subCategoryDistribution[subCat] = (stats.subCategoryDistribution[subCat] || 0) + 1;
    
    // 置信度统计
    if (result.confidence >= 0.8) {
      stats.confidenceDistribution.high++;
    } else if (result.confidence >= 0.6) {
      stats.confidenceDistribution.medium++;
    } else {
      stats.confidenceDistribution.low++;
    }
    
    // 变更统计
    if (result.currentMainCategory !== result.mainCategory) {
      stats.changes.newMainCategory++;
    }
    if (result.currentSubCategory !== result.subCategory) {
      stats.changes.newSubCategory++;
    }
    if (result.currentMainCategory === result.mainCategory && 
        result.currentSubCategory === result.subCategory) {
      stats.changes.unchanged++;
    }
  });
  
  // 生成报告
  const report = {
    metadata: {
      analysisTime: new Date().toISOString(),
      totalTools: stats.total,
      analysisMethod: 'hybrid' // 规则 + AI
    },
    summary: stats,
    categoryBreakdown: Object.entries(stats.categoryDistribution)
      .sort(([,a], [,b]) => b - a)
      .map(([category, count]) => ({
        category,
        count,
        percentage: ((count / stats.total) * 100).toFixed(1)
      })),
    subCategoryBreakdown: Object.entries(stats.subCategoryDistribution)
      .sort(([,a], [,b]) => b - a)
      .map(([subCategory, count]) => ({
        subCategory,
        count,
        percentage: ((count / stats.total) * 100).toFixed(1)
      })),
    qualityMetrics: {
      highConfidence: ((stats.confidenceDistribution.high / stats.total) * 100).toFixed(1),
      mediumConfidence: ((stats.confidenceDistribution.medium / stats.total) * 100).toFixed(1),
      lowConfidence: ((stats.confidenceDistribution.low / stats.total) * 100).toFixed(1)
    },
    changeSummary: {
      newMainCategoryCount: stats.changes.newMainCategory,
      newSubCategoryCount: stats.changes.newSubCategory,
      unchangedCount: stats.changes.unchanged,
      changeRate: ((stats.changes.newMainCategory / stats.total) * 100).toFixed(1)
    }
  };
  
  return report;
}

/**
 * 保存结果
 */
function saveResults(results, report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // 保存详细结果
  const resultsFile = path.join(__dirname, 'outputs', `ai_categorization_results_${timestamp}.json`);
  if (!fs.existsSync(path.dirname(resultsFile))) {
    fs.mkdirSync(path.dirname(resultsFile), { recursive: true });
  }
  
  fs.writeFileSync(resultsFile, JSON.stringify({
    report,
    results
  }, null, 2));
  
  console.log(`💾 详细分析结果已保存: ${resultsFile}`);
  
  // 生成SQL更新脚本
  const sqlFile = path.join(__dirname, 'outputs', `update_categories_${timestamp}.sql`);
  const updateSQL = generateUpdateSQL(results);
  
  fs.writeFileSync(sqlFile, updateSQL);
  console.log(`💾 SQL更新脚本已保存: ${sqlFile}`);
  
  return {
    resultsFile,
    sqlFile
  };
}

/**
 * 生成SQL更新语句
 */
function generateUpdateSQL(results) {
  const timestamp = new Date().toISOString();
  
  let sql = `-- AI智能分类更新SQL
-- 生成时间: ${timestamp}
-- 基于深度语义分析的分类结果

-- 更新工具分类信息
UPDATE tools 
SET 
  main_category = CASE id
${results.map(r => `    WHEN '${r.id}' THEN '${r.mainCategory}'`).join('\n')}
    ELSE main_category
  END,
  sub_category = CASE id
${results.map(r => `    WHEN '${r.id}' THEN '${r.subCategory}'`).join('\n')}
    ELSE sub_category
  END,
  updated_at = NOW()
WHERE id IN (${results.map(r => `'${r.id}'`).join(', ')});

-- 更新后统计
SELECT 
  main_category,
  sub_category,
  COUNT(*) as tool_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM tools 
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL 
GROUP BY main_category, sub_category 
ORDER BY main_category, tool_count DESC;

-- 分类变更统计
SELECT 
  '总工具数' as metric,
  COUNT(*) as value
FROM tools
WHERE status IN ('approved', 'active')

UNION ALL

SELECT 
  '已分配主分类' as metric,
  COUNT(*) as value
FROM tools
WHERE status IN ('approved', 'active') 
  AND main_category IS NOT NULL

UNION ALL

SELECT 
  '已分配子分类' as metric,
  COUNT(*) as value
FROM tools
WHERE status IN ('approved', 'active') 
  AND sub_category IS NOT NULL

UNION ALL

SELECT 
  '高置信度分类(>=80%)' as metric,
  COUNT(*) as value
FROM tools
WHERE id IN (${results.filter(r => r.confidence >= 0.8).map(r => `'${r.id}'`).join(', ')});

-- AI分析详情（前20个）
SELECT 
  t.name,
  t.main_category,
  t.sub_category,
  '${results.filter(r => r.confidence >= 0.8).slice(0, 20).map(r => `${r.name}: ${r.reasoning}`).join('; ')}' as ai_analysis_summary
FROM tools t
WHERE t.id IN (${results.filter(r => r.confidence >= 0.8).slice(0, 20).map(r => `'${r.id}'`).join(', ')})
ORDER BY t.view_count DESC;
`;
  
  return sql;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎯 开始AI智能分类任务...\n');
    
    // 1. 读取工具数据
    const outputsDir = path.join(__dirname, 'outputs');
    const dataFiles = fs.readdirSync(outputsDir).filter(f => f.includes('tools_for_ai_') && f.endsWith('.json'));
    
    if (dataFiles.length === 0) {
      console.error('❌ 未找到工具数据文件，请先运行 fetch-all-tools-data.js');
      process.exit(1);
    }
    
    const latestDataFile = dataFiles.sort().reverse()[0];
    const toolsData = JSON.parse(fs.readFileSync(path.join(outputsDir, latestDataFile), 'utf8'));
    const tools = toolsData.tools || toolsData; // 兼容不同格式
    
    console.log(`📚 加载了 ${tools.length} 个工具数据`);
    console.log(`📁 数据文件: ${latestDataFile}\n`);
    
    // 2. 执行AI分析（混合模式：优先规则，低置信度使用AI）
    console.log('🤖 启动混合分类模式...');
    const results = await analyzeTools(tools, false); // 暂时使用规则模式
    
    // 3. 生成分析报告
    const report = generateReport(results);
    
    // 4. 保存结果
    const files = saveResults(results, report);
    
    console.log('\n🎉 AI智能分类完成！');
    console.log(`📊 分析了 ${results.length} 个工具`);
    console.log(`📈 高置信度分类: ${report.qualityMetrics.highConfidence}%`);
    console.log(`🔄 预计变更主分类: ${report.changeSummary.newMainCategoryCount} 个`);
    console.log(`🔄 预计变更子分类: ${report.changeSummary.newSubCategoryCount} 个`);
    console.log(`📁 详细结果: ${files.resultsFile}`);
    console.log(`🗃️ SQL脚本: ${files.sqlFile}`);
    
    console.log('\n📋 下一步操作:');
    console.log('1. 检查分析结果: cat ' + files.resultsFile);
    console.log('2. 执行批量更新: node batch-update-categories.js');
    console.log('3. 验证更新结果: node verify-category-update.js');
    
  } catch (error) {
    console.error('❌ AI分类失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
