#!/usr/bin/env node

/**
 * 修复无效子分类脚本
 * 将无效子分类映射到有效的子分类
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
 * 获取有效的子分类映射
 */
function getValidSubCategoryMapping() {
  return {
    // 编程类
    'coding_documentation': 'coding_generation',
    
    // AI智能体类
    'ai_agent': 'ai_platform',
    'ai_other': 'ai_other', // 这个应该是有效的
    
    // 搜索类
    'search_academic': 'search_smart',
    
    // 图像类
    'image_design': 'image_generation',
    'image_editing': 'image_editing', // 修正拼写错误
    'image_recognition': 'image_generation',
    
    // 视频类
    'video_enhancement': 'video_editing',
    
    // 音频类
    'audio_transcription': 'audio_synthesis',
    
    // 写作类
    'writing_academic': 'writing_marketing',
    'writing_business': 'writing_marketing',
    'writing_translation': 'writing_marketing',
    
    // 办公类
    'office_data': 'office_document',
    'office_presentation': 'office_document',
    'office_meeting': 'office_document',
    
    // 对话类
    'chat_companion': 'chat_general',
    'chat_multimodal': 'chat_general',
    'chat_professional': 'chat_general',
    
    // 默认映射
    'default': 'coding_generation'
  };
}

/**
 * 获取所有有无效子分类的工具
 */
async function getInvalidSubCategoryTools() {
  console.log('🔍 查找有无效子分类的工具...');
  
  // 首先获取所有有效的子分类
  const { data: validSubCategories, error: subError } = await supabase
    .from('sub_categories')
    .select('id');
  
  if (subError) {
    console.error('❌ 获取有效子分类失败:', subError);
    return [];
  }
  
  const validSubCategoryIds = validSubCategories.map(cat => cat.id);
  console.log(`📋 有效子分类数量: ${validSubCategoryIds.length}`);
  
  // 查找有无效子分类的工具
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, main_category, sub_category')
    .in('status', ['approved', 'active'])
    .or(`sub_category.not.in.(${validSubCategoryIds.map(id => `'${id}'`).join(',')}),sub_category.is.null`);
  
  if (error) {
    console.error('❌ 获取无效子分类工具失败:', error);
    return [];
  }
  
  console.log(`📦 找到 ${tools.length} 个有无效子分类的工具`);
  return tools;
}

/**
 * 修复子分类
 */
function fixSubCategory(tool, mapping) {
  const invalidSubCategory = tool.sub_category;
  const mainCategory = tool.main_category;
  
  // 根据主分类和无效子分类确定正确的子分类
  let fixedSubCategory = mapping.default;
  
  // 特殊映射
  if (mapping[invalidSubCategory]) {
    fixedSubCategory = mapping[invalidSubCategory];
  } else {
    // 根据主分类选择默认子分类
    switch (mainCategory) {
      case 'coding':
        fixedSubCategory = 'coding_generation';
        break;
      case 'ai_agent':
        fixedSubCategory = 'ai_platform';
        break;
      case 'chat':
        fixedSubCategory = 'chat_general';
        break;
      case 'image':
        fixedSubCategory = 'image_generation';
        break;
      case 'video':
        fixedSubCategory = 'video_generation';
        break;
      case 'audio':
        fixedSubCategory = 'audio_synthesis';
        break;
      case 'writing':
        fixedSubCategory = 'writing_marketing';
        break;
      case 'office':
        fixedSubCategory = 'office_document';
        break;
      case 'search':
        fixedSubCategory = 'search_smart';
        break;
      default:
        fixedSubCategory = 'coding_generation';
    }
  }
  
  return {
    id: tool.id,
    name: tool.name,
    mainCategory: tool.main_category,
    oldSubCategory: tool.sub_category,
    newSubCategory: fixedSubCategory
  };
}

/**
 * 批量修复子分类
 */
async function fixInvalidSubCategories() {
  console.log('🔧 开始修复无效子分类...\n');
  
  // 1. 获取有无效子分类的工具
  const tools = await getInvalidSubCategoryTools();
  
  if (tools.length === 0) {
    console.log('✅ 没有找到需要修复的工具');
    return;
  }
  
  // 2. 获取映射规则
  const mapping = getValidSubCategoryMapping();
  
  console.log(`📊 开始修复 ${tools.length} 个工具的子分类...\n`);
  
  // 3. 修复每个工具
  const fixResults = [];
  
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    console.log(`📊 进度: ${i + 1}/${tools.length} - 修复工具: ${tool.name}`);
    
    const result = fixSubCategory(tool, mapping);
    fixResults.push(result);
    
    console.log(`  🔧 ${result.oldSubCategory} → ${result.newSubCategory}`);
    console.log('');
  }
  
  // 4. 统计修复结果
  const stats = {};
  fixResults.forEach(result => {
    const key = result.newSubCategory;
    stats[key] = (stats[key] || 0) + 1;
  });
  
  console.log('📊 修复统计:');
  Object.entries(stats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([subCategory, count]) => {
      console.log(`  ${subCategory}: ${count} 个工具`);
    });
  
  return fixResults;
}

/**
 * 更新数据库
 */
async function updateFixedSubCategories(results) {
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
 * 保存修复报告
 */
function saveFixReport(results, updateStats) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(__dirname, 'outputs', `subcategory_fix_report_${timestamp}.json`);
  
  if (!fs.existsSync(path.dirname(reportFile))) {
    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  }
  
  const report = {
    metadata: {
      fixTime: new Date().toISOString(),
      operation: 'invalid_subcategory_fix'
    },
    summary: {
      totalTools: results.length,
      successCount: updateStats.successCount,
      failCount: updateStats.failCount,
      successRate: ((updateStats.successCount / results.length) * 100).toFixed(1)
    },
    results,
    subCategoryDistribution: results.reduce((acc, result) => {
      const key = result.newSubCategory;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`💾 修复报告已保存: ${reportFile}`);
  
  return reportFile;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎯 开始修复无效子分类任务...\n');
    
    // 1. 修复无效子分类
    const results = await fixInvalidSubCategories();
    
    if (results.length === 0) {
      console.log('✅ 没有需要修复的子分类');
      return;
    }
    
    // 2. 更新数据库
    const updateStats = await updateFixedSubCategories(results);
    
    // 3. 保存报告
    const reportFile = saveFixReport(results, updateStats);
    
    console.log('\n🎉 无效子分类修复完成！');
    console.log(`📊 修复了 ${results.length} 个工具的子分类`);
    console.log(`✅ 成功更新 ${updateStats.successCount} 个`);
    console.log(`📁 报告文件: ${reportFile}`);
    
    console.log('\n📋 下一步操作:');
    console.log('1. 验证修复结果: node verify-category-update.js');
    console.log('2. 检查网站显示效果: npm run dev');
    console.log('3. 测试分类筛选功能');
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
