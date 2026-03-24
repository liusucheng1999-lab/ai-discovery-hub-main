#!/usr/bin/env node

/**
 * 全量数据抓取脚本
 * 从Supabase数据库抓取所有工具数据
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

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 分页获取所有工具数据
 */
async function fetchAllTools() {
  console.log('🚀 开始抓取所有工具数据...');
  
  const allTools = [];
  const pageSize = 1000; // 每页数量
  let page = 0;
  let hasMore = true;
  
  while (hasMore) {
    try {
      console.log(`📄 抓取第 ${page + 1} 页数据...`);
      
      const { data: tools, error, count } = await supabase
        .from('tools')
        .select(`
          id,
          name,
          tagline,
          description,
          tags,
          website_url,
          category,
          main_category,
          sub_category,
          status,
          view_count,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      
      if (error) {
        console.error('❌ 数据抓取失败:', error);
        throw error;
      }
      
      if (tools && tools.length > 0) {
        allTools.push(...tools);
        console.log(`✅ 成功抓取 ${tools.length} 个工具，累计: ${allTools.length}`);
        
        // 如果返回的数据少于页面大小，说明已经是最后一页
        if (tools.length < pageSize) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
      
      page++;
      
      // 防止请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ 第 ${page + 1} 页抓取失败:`, error);
      hasMore = false;
    }
  }
  
  return allTools;
}

/**
 * 分析数据统计
 */
function analyzeData(tools) {
  console.log('\n📊 数据分析结果:');
  console.log(`📦 总工具数量: ${tools.length}`);
  
  // 状态统计
  const statusStats = {};
  tools.forEach(tool => {
    statusStats[tool.status] = (statusStats[tool.status] || 0) + 1;
  });
  
  console.log('\n📈 状态分布:');
  Object.entries(statusStats).forEach(([status, count]) => {
    console.log(`  ${status}: ${count} 个 (${((count / tools.length) * 100).toFixed(1)}%)`);
  });
  
  // 分类统计
  const categoryStats = {};
  tools.forEach(tool => {
    const category = tool.main_category || tool.category || '未分类';
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  console.log('\n🏷️ 主分类分布:');
  Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} 个 (${((count / tools.length) * 100).toFixed(1)}%)`);
    });
  
  // 二级分类统计
  const subCategoryStats = {};
  let hasSubCategories = false;
  tools.forEach(tool => {
    if (tool.sub_category) {
      hasSubCategories = true;
      const key = `${tool.main_category || 'unknown'}_${tool.sub_category}`;
      subCategoryStats[key] = (subCategoryStats[key] || 0) + 1;
    }
  });
  
  if (hasSubCategories) {
    console.log('\n📂 二级分类分布:');
    Object.entries(subCategoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([subCategory, count]) => {
        console.log(`  ${subCategory}: ${count} 个`);
      });
  } else {
    console.log('\n⚠️ 暂无二级分类数据');
  }
  
  // 数据质量检查
  console.log('\n🔍 数据质量检查:');
  const missingName = tools.filter(t => !t.name).length;
  const missingDescription = tools.filter(t => !t.description).length;
  const missingWebsite = tools.filter(t => !t.website_url).length;
  const missingTags = tools.filter(t => !t.tags || t.tags.length === 0).length;
  
  console.log(`  缺少名称: ${missingName} 个`);
  console.log(`  缺少描述: ${missingDescription} 个`);
  console.log(`  缺少网站: ${missingWebsite} 个`);
  console.log(`  缺少标签: ${missingTags} 个`);
  
  return {
    total: tools.length,
    statusStats,
    categoryStats,
    subCategoryStats,
    qualityIssues: {
      missingName,
      missingDescription,
      missingWebsite,
      missingTags
    }
  };
}

/**
 * 保存数据到文件
 */
function saveDataToFile(tools, stats) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // 保存原始数据
  const dataFile = path.join(__dirname, 'outputs', `tools_data_${timestamp}.json`);
  if (!fs.existsSync(path.dirname(dataFile))) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  }
  
  fs.writeFileSync(dataFile, JSON.stringify({
    metadata: {
      exportTime: new Date().toISOString(),
      totalTools: tools.length,
      stats
    },
    tools
  }, null, 2));
  
  console.log(`💾 原始数据已保存: ${dataFile}`);
  
  // 保存简化数据用于AI分析
  const simplifiedTools = tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    tags: tool.tags || [],
    website_url: tool.website_url,
    current_category: tool.category,
    current_main_category: tool.main_category,
    current_sub_category: tool.sub_category,
    status: tool.status
  }));
  
  const simplifiedFile = path.join(__dirname, 'outputs', `tools_for_ai_${timestamp}.json`);
  fs.writeFileSync(simplifiedFile, JSON.stringify(simplifiedTools, null, 2));
  
  console.log(`💾 AI分析数据已保存: ${simplifiedFile}`);
  
  return {
    dataFile,
    simplifiedFile
  };
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎯 开始全量数据抓取任务...\n');
    
    // 1. 抓取所有工具数据
    const tools = await fetchAllTools();
    
    if (tools.length === 0) {
      console.log('⚠️ 未找到任何工具数据');
      return;
    }
    
    // 2. 分析数据
    const stats = analyzeData(tools);
    
    // 3. 保存数据
    const files = saveDataToFile(tools, stats);
    
    console.log('\n🎉 数据抓取完成！');
    console.log(`📊 总计抓取 ${tools.length} 个工具`);
    console.log(`📁 数据文件: ${files.dataFile}`);
    console.log(`🤖 AI分析文件: ${files.simplifiedFile}`);
    
    // 4. 生成下一步建议
    console.log('\n📋 下一步操作建议:');
    console.log('1. 运行AI智能分类: node ai-smart-categorization.js');
    console.log('2. 执行批量更新: node batch-update-categories.js');
    console.log('3. 验证更新结果: node verify-category-update.js');
    
  } catch (error) {
    console.error('❌ 数据抓取失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
