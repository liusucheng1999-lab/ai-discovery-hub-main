#!/usr/bin/env node

/**
 * 重新分类ai_agent分类下的工具
 * 删除ai_agent主分类，将工具重新分配到合适的分类
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase配置
const supabaseUrl = 'https://enzduxajblrfbbdktieo.supabase.co';
const supabaseKey = 'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 获取所有ai_agent分类的工具
 */
async function getAiAgentCategoryTools() {
  console.log('🔍 获取ai_agent分类下的工具...');
  
  const { data: tools, error } = await supabase
    .from('tools')
    .select('*')
    .eq('main_category', 'ai_agent')
    .in('status', ['approved', 'active']);
  
  if (error) {
    console.error('❌ 获取ai_agent分类工具失败:', error);
    return [];
  }
  
  console.log(`📦 找到 ${tools.length} 个ai_agent分类的工具`);
  return tools;
}

/**
 * 基于工具信息重新分类
 */
function reclassifyAiAgentTool(tool) {
  const { name, tagline, description, tags, website_url } = tool;
  
  // 构建分析文本
  const fullText = `${name} ${tagline} ${description} ${(tags || []).join(' ')} ${website_url}`.toLowerCase();
  
  // 重新分类逻辑，排除ai_agent分类
  let mainCategory = null;
  let subCategory = null;
  let reasoning = '';
  
  // 💻 编程类分析 - 优先检查开发相关
  if (fullText.includes('code') || fullText.includes('编程') || fullText.includes('开发') ||
      fullText.includes('programming') || fullText.includes('api') || fullText.includes('dev') ||
      fullText.includes('github') || fullText.includes('gitlab') || fullText.includes('repository') ||
      fullText.includes('framework') || fullText.includes('library') || fullText.includes('sdk') ||
      fullText.includes('langchain') || fullText.includes('python') || fullText.includes('javascript')) {
    
    mainCategory = 'coding';
    reasoning = '识别为编程类：软件开发相关工具';
    
    if (fullText.includes('生成') || fullText.includes('generate') || fullText.includes('编写') ||
        fullText.includes('assistant') || fullText.includes('copilot')) {
      subCategory = 'coding_generation';
      reasoning += ' -> 代码生成：AI辅助编程';
    } else if (fullText.includes('文档') || fullText.includes('documentation') || fullText.includes('api')) {
      subCategory = 'coding_documentation';
      reasoning += ' -> 技术文档：API和文档工具';
    } else if (fullText.includes('测试') || fullText.includes('test') || fullText.includes('debug')) {
      subCategory = 'coding_testing';
      reasoning += ' -> 测试运维：测试和部署工具';
    } else {
      subCategory = 'coding_generation';
      reasoning += ' -> 代码生成：通用编程工具';
    }
  }
  
  // 💬 对话类分析 - AI助手和聊天机器人
  else if (fullText.includes('chat') || fullText.includes('对话') || fullText.includes('聊天') ||
           fullText.includes('gpt') || fullText.includes('claude') || fullText.includes('gemini') ||
           fullText.includes('assistant') || fullText.includes('问答') || fullText.includes('助手') ||
           fullText.includes('bot') || fullText.includes('robot') || fullText.includes('companion')) {
    
    mainCategory = 'chat';
    reasoning = '识别为对话类：AI对话和助手工具';
    
    if (fullText.includes('通用') || fullText.includes('general') || fullText.includes('多模态')) {
      subCategory = 'chat_general';
      reasoning += ' -> 通用对话：通用AI助手';
    } else if (fullText.includes('专业') || fullText.includes('legal') || fullText.includes('medical')) {
      subCategory = 'chat_professional';
      reasoning += ' -> 专业问答：专业领域助手';
    } else {
      subCategory = 'chat_general';
      reasoning += ' -> 通用对话：通用对话工具';
    }
  }
  
  // 🔍 搜索类分析
  else if (fullText.includes('search') || fullText.includes('搜索') || fullText.includes('检索') ||
           fullText.includes('research') || fullText.includes('find') || fullText.includes('discover') ||
           fullText.includes('google') || fullText.includes('bing') || fullText.includes('perplexity') ||
           fullText.includes('导航') || fullText.includes('聚合') || fullText.includes('资讯')) {
    
    mainCategory = 'search';
    reasoning = '识别为搜索类：信息检索和搜索工具';
    
    if (fullText.includes('智能') || fullText.includes('ai') || fullText.includes('realtime')) {
      subCategory = 'search_smart';
      reasoning += ' -> 智能搜索：AI驱动的搜索';
    } else if (fullText.includes('学术') || fullText.includes('academic') || fullText.includes('paper')) {
      subCategory = 'search_academic';
      reasoning += ' -> 学术检索：学术搜索工具';
    } else {
      subCategory = 'search_smart';
      reasoning += ' -> 智能搜索：通用搜索工具';
    }
  }
  
  // 🎨 图像类分析
  else if (fullText.includes('image') || fullText.includes('图像') || fullText.includes('绘画') ||
           fullText.includes('design') || fullText.includes('art') || fullText.includes('photo') ||
           fullText.includes('midjourney') || fullText.includes('stable-diffusion') || fullText.includes('dall-e')) {
    
    mainCategory = 'image';
    reasoning = '识别为图像类：视觉内容工具';
    
    if (fullText.includes('生成') || fullText.includes('generate') || fullText.includes('绘画') ||
        fullText.includes('创作') || fullText.includes('art')) {
      subCategory = 'image_generation';
      reasoning += ' -> 绘图生成：AI图像创作';
    } else if (fullText.includes('设计') || fullText.includes('design') || fullText.includes('logo')) {
      subCategory = 'image_design';
      reasoning += ' -> 设计辅助：设计工具';
    } else {
      subCategory = 'image_generation';
      reasoning += ' -> 绘图生成：通用图像工具';
    }
  }
  
  // 🎬 视频类分析
  else if (fullText.includes('video') || fullText.includes('视频') || fullText.includes('动画') ||
           fullText.includes('剪辑') || fullText.includes('movie') || fullText.includes('animation')) {
    
    mainCategory = 'video';
    reasoning = '识别为视频类：视频内容工具';
    
    if (fullText.includes('生成') || fullText.includes('generate') || fullText.includes('制作')) {
      subCategory = 'video_generation';
      reasoning += ' -> 视频生成：AI视频创作';
    } else {
      subCategory = 'video_generation';
      reasoning += ' -> 视频生成：通用视频工具';
    }
  }
  
  // 🎵 音频类分析
  else if (fullText.includes('audio') || fullText.includes('音乐') || fullText.includes('语音') ||
           fullText.includes('voice') || fullText.includes('sound') || fullText.includes('tts') ||
           fullText.includes('suno') || fullText.includes('udio')) {
    
    mainCategory = 'audio';
    reasoning = '识别为音频类：音频内容工具';
    
    if (fullText.includes('合成') || fullText.includes('tts') || fullText.includes('speech')) {
      subCategory = 'audio_synthesis';
      reasoning += ' -> 语音合成：语音生成';
    } else if (fullText.includes('音乐') || fullText.includes('music')) {
      subCategory = 'audio_composition';
      reasoning += ' -> 音乐创作：音乐生成';
    } else {
      subCategory = 'audio_synthesis';
      reasoning += ' -> 语音合成：通用音频工具';
    }
  }
  
  // ✍️ 写作类分析
  else if (fullText.includes('writing') || fullText.includes('写作') || fullText.includes('文案') ||
           fullText.includes('翻译') || fullText.includes('润色') || fullText.includes('论文') ||
           fullText.includes('content') || fullText.includes('article') || fullText.includes('essay')) {
    
    mainCategory = 'writing';
    reasoning = '识别为写作类：文本创作工具';
    
    if (fullText.includes('营销') || fullText.includes('marketing') || fullText.includes('seo')) {
      subCategory = 'writing_marketing';
      reasoning += ' -> 文案营销：营销内容';
    } else {
      subCategory = 'writing_marketing';
      reasoning += ' -> 文案营销：通用写作工具';
    }
  }
  
  // 📊 办公类分析
  else if (fullText.includes('office') || fullText.includes('办公') || fullText.includes('文档') ||
           fullText.includes('excel') || fullText.includes('ppt') || fullText.includes('pdf') ||
           fullText.includes('presentation') || fullText.includes('slide') || fullText.includes('会议')) {
    
    mainCategory = 'office';
    reasoning = '识别为办公类：办公效率工具';
    
    if (fullText.includes('文档') || fullText.includes('document') || fullText.includes('pdf')) {
      subCategory = 'office_document';
      reasoning += ' -> 文档处理：文档工具';
    } else if (fullText.includes('ppt') || fullText.includes('presentation')) {
      subCategory = 'office_presentation';
      reasoning += ' -> 演示制作：PPT工具';
    } else if (fullText.includes('会议') || fullText.includes('meeting')) {
      subCategory = 'office_meeting';
      reasoning += ' -> 会议辅助：会议工具';
    } else {
      subCategory = 'office_document';
      reasoning += ' -> 文档处理：通用办公工具';
    }
  }
  
  // 默认分类（如果无法识别，分配到最相关的分类）
  else {
    // 根据工具名称和描述进行启发式分类
    if (fullText.includes('model') || fullText.includes('api') || fullText.includes('service')) {
      mainCategory = 'coding';
      subCategory = 'coding_generation';
      reasoning = '默认分类：编程类（模型/API服务）';
    } else if (fullText.includes('ai') || fullText.includes('智能') || fullText.includes('artificial')) {
      mainCategory = 'chat';
      subCategory = 'chat_general';
      reasoning = '默认分类：对话类（AI相关工具）';
    } else if (fullText.includes('platform') || fullText.includes('平台') || fullText.includes('hub')) {
      mainCategory = 'search';
      subCategory = 'search_smart';
      reasoning = '默认分类：搜索类（平台和导航）';
    } else {
      mainCategory = 'coding';
      subCategory = 'coding_generation';
      reasoning = '默认分类：编程类（开发者工具）';
    }
  }
  
  return {
    id: tool.id,
    name: tool.name,
    oldMainCategory: tool.main_category,
    oldSubCategory: tool.sub_category,
    newMainCategory: mainCategory,
    newSubCategory: subCategory,
    reasoning
  };
}

/**
 * 批量重新分类
 */
async function reclassifyAiAgentTools() {
  console.log('🔄 开始重新分类ai_agent分类下的工具...\n');
  
  // 1. 获取所有ai_agent分类的工具
  const tools = await getAiAgentCategoryTools();
  
  if (tools.length === 0) {
    console.log('✅ 没有找到ai_agent分类的工具');
    return [];
  }
  
  console.log(`📊 开始分析 ${tools.length} 个工具...\n`);
  
  // 2. 重新分类每个工具
  const reclassificationResults = [];
  
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    console.log(`📊 进度: ${i + 1}/${tools.length} - 分析工具: ${tool.name}`);
    
    const result = reclassifyAiAgentTool(tool);
    reclassificationResults.push(result);
    
    console.log(`  🔄 ${result.oldMainCategory}/${result.oldSubCategory} → ${result.newMainCategory}/${result.newSubCategory}`);
    console.log(`  💡 ${result.reasoning}`);
    console.log('');
  }
  
  // 3. 统计重新分类结果
  const stats = {};
  reclassificationResults.forEach(result => {
    const key = `${result.newMainCategory}_${result.newSubCategory}`;
    stats[key] = (stats[key] || 0) + 1;
  });
  
  console.log('📊 重新分类统计:');
  Object.entries(stats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} 个工具`);
    });
  
  return reclassificationResults;
}

/**
 * 更新数据库
 */
async function updateReclassifiedAiAgentTools(results) {
  console.log('\n🚀 开始更新数据库...');
  
  let successCount = 0;
  let failCount = 0;
  
  // 分批更新
  const batchSize = 50;
  const batches = Math.ceil(results.length / batchSize);
  
  for (let batch = 0; batch < batches; batch++) {
    const startIdx = batch * batchSize;
    const endIdx = Math.min(startIdx + batchSize, results.length);
    const batchResults = results.slice(startIdx, endIdx);
    
    console.log(`📦 处理第 ${batch + 1}/${batches} 批 (${startIdx + 1}-${endIdx})...`);
    
    for (const result of batchResults) {
      try {
        const { error } = await supabase
          .from('tools')
          .update({
            main_category: result.newMainCategory,
            sub_category: result.newSubCategory,
            updated_at: new Date().toISOString()
          })
          .eq('id', result.id);
        
        if (error) {
          console.error(`❌ 更新失败 ${result.name}:`, error);
          failCount++;
        } else {
          console.log(`✅ 更新成功 ${result.name}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ 更新异常 ${result.name}:`, error.message);
        failCount++;
      }
      
      // 请求间隔
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ 第 ${batch + 1} 批完成，休息 1 秒...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 更新统计:`);
  console.log(`✅ 成功: ${successCount} 个`);
  console.log(`❌ 失败: ${failCount} 个`);
  console.log(`📈 成功率: ${((successCount / results.length) * 100).toFixed(1)}%`);
  
  return { successCount, failCount };
}

/**
 * 保存重新分类报告
 */
function saveAiAgentReclassificationReport(results, updateStats) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(__dirname, 'outputs', `ai_agent_reclassification_report_${timestamp}.json`);
  
  if (!fs.existsSync(path.dirname(reportFile))) {
    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  }
  
  const report = {
    metadata: {
      reclassificationTime: new Date().toISOString(),
      operation: 'ai_agent_category_reclassification'
    },
    summary: {
      totalTools: results.length,
      successCount: updateStats.successCount,
      failCount: updateStats.failCount,
      successRate: ((updateStats.successCount / results.length) * 100).toFixed(1)
    },
    results,
    categoryDistribution: results.reduce((acc, result) => {
      const key = `${result.newMainCategory}_${result.newSubCategory}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`💾 重新分类报告已保存: ${reportFile}`);
  
  return reportFile;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎯 开始ai_agent分类重新分类任务...\n');
    
    // 1. 重新分类
    const results = await reclassifyAiAgentTools();
    
    if (results.length === 0) {
      console.log('✅ 没有需要重新分类的工具');
      return;
    }
    
    // 2. 更新数据库
    const updateStats = await updateReclassifiedAiAgentTools(results);
    
    // 3. 保存报告
    const reportFile = saveAiAgentReclassificationReport(results, updateStats);
    
    console.log('\n🎉 ai_agent分类重新分类完成！');
    console.log(`📊 重新分类了 ${results.length} 个工具`);
    console.log(`✅ 成功更新 ${updateStats.successCount} 个`);
    console.log(`📁 报告文件: ${reportFile}`);
    
    console.log('\n📋 下一步操作:');
    console.log('1. 验证重新分类结果: node verify-category-update.js');
    console.log('2. 检查网站显示效果: npm run dev');
    console.log('3. 测试分类筛选功能');
    
  } catch (error) {
    console.error('❌ 重新分类失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
