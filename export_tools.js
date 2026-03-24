import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function exportToolsData() {
  try {
    // 获取所有数据
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, category, main_category, sub_category, status');
    
    if (error) throw error;
    
    console.log('=== 导出所有工具数据 ===');
    console.log('总记录数:', tools.length);
    
    // 保存为JSON文件
    fs.writeFileSync('tools_export.json', JSON.stringify(tools, null, 2));
    console.log('数据已保存到 tools_export.json');
    
    // 统计分析
    const statusStats = {};
    const categoryStats = {};
    const mainCategoryStats = {};
    const subCategoryStats = {};
    
    tools.forEach(tool => {
      statusStats[tool.status] = (statusStats[tool.status] || 0) + 1;
      categoryStats[tool.category] = (categoryStats[tool.category] || 0) + 1;
      mainCategoryStats[tool.main_category] = (mainCategoryStats[tool.main_category] || 0) + 1;
      subCategoryStats[tool.sub_category] = (subCategoryStats[tool.sub_category] || 0) + 1;
    });
    
    console.log('\n=== 状态统计 ===');
    console.log(JSON.stringify(statusStats, null, 2));
    
    console.log('\n=== 原分类统计 ===');
    console.log(JSON.stringify(categoryStats, null, 2));
    
    console.log('\n=== 主分类统计 ===');
    console.log(JSON.stringify(mainCategoryStats, null, 2));
    
    console.log('\n=== 子分类统计 ===');
    console.log(JSON.stringify(subCategoryStats, null, 2));
    
  } catch (error) {
    console.error('导出数据失败:', error.message);
  }
}

exportToolsData();
