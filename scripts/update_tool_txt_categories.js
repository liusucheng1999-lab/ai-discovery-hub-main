// 按照tool.txt文件内容更新应用分类
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

// 从tool.txt文件解析分类数据
function parseToolFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  const categoryMapping = [];
  
  lines.forEach(line => {
    // 解析格式: 主分类,子分类,应用名称
    const parts = line.split(',').map(part => part.trim());
    if (parts.length === 3) {
      const [mainCategory, subCategory, appName] = parts;
      
      // 映射到数据库的分类ID
      let mainCategoryId = mainCategory;
      let subCategoryId = subCategory;
      
      // 特殊映射
      switch (mainCategory) {
        case '编程':
          mainCategoryId = 'coding';
          break;
        case '办公':
          mainCategoryId = 'office';
          break;
        case '工具':
          mainCategoryId = 'tools';
          break;
        case '职场':
          mainCategoryId = 'career';
          break;
      }
      
      // 子分类映射
      switch (subCategory) {
        case '代码编写':
          subCategoryId = 'coding_code';
          break;
        case 'AI工程':
          subCategoryId = 'coding_ai';
          break;
        case '开发工具':
          subCategoryId = 'coding_dev';
          break;
        case '智能体开发':
          subCategoryId = 'coding_agent';
          break;
        case 'PPT演示':
          subCategoryId = 'office_ppt';
          break;
        case '文档协同':
          subCategoryId = 'office_doc';
          break;
        case '数据表格':
          subCategoryId = 'office_data';
          break;
        case '思维导图':
          subCategoryId = 'office_mind';
          break;
        case '智能搜索':
          subCategoryId = 'tools_search';
          break;
        case '效率工具':
          subCategoryId = 'tools_efficiency';
          break;
        case '学习科研':
          subCategoryId = 'tools_learn';
          break;
        case '小众工具':
          subCategoryId = 'tools_niche';
          break;
        case '求职辅助':
          subCategoryId = 'career_job';
          break;
        case '法律合规':
          subCategoryId = 'career_legal';
          break;
        case '职场工具':
          subCategoryId = 'career_work';
          break;
      }
      
      categoryMapping.push({
        name: appName,
        main_category: mainCategoryId,
        sub_category: subCategoryId
      });
    }
  });
  
  return categoryMapping;
}

async function updateToolCategories() {
  console.log('开始按照tool.txt文件更新应用分类...');
  
  // 解析tool.txt文件
  const toolCategoryMapping = parseToolFile('./tool.txt');
  console.log(`从tool.txt解析出 ${toolCategoryMapping.length} 个应用分类映射`);
  
  let successCount = 0;
  let failCount = 0;
  const notFoundApps = [];
  const categoryStats = {};
  
  for (const app of toolCategoryMapping) {
    try {
      // 查找应用
      const { data: existingApp, error: findError } = await supabase
        .from('tools')
        .select('*')
        .eq('name', app.name)
        .single();
      
      if (findError || !existingApp) {
        console.log(`未找到应用: ${app.name}`);
        notFoundApps.push(app.name);
        failCount++;
        continue;
      }
      
      // 更新分类
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          main_category: app.main_category,
          sub_category: app.sub_category,
          updated_at: new Date().toISOString()
        })
        .eq('name', app.name);
      
      if (updateError) {
        console.error(`更新应用 ${app.name} 失败:`, updateError);
        failCount++;
      } else {
        console.log(`✓ ${app.name} -> ${app.main_category}/${app.sub_category}`);
        successCount++;
        
        // 统计分类数量
        const key = `${app.main_category}/${app.sub_category}`;
        categoryStats[key] = (categoryStats[key] || 0) + 1;
      }
      
    } catch (error) {
      console.error(`处理应用 ${app.name} 时出错:`, error);
      failCount++;
    }
    
    // 每100个应用输出一次进度
    if ((successCount + failCount) % 100 === 0) {
      console.log(`已处理: ${successCount + failCount}/${toolCategoryMapping.length}`);
    }
  }
  
  console.log('\n=== tool.txt分类更新完成 ===');
  console.log(`成功更新: ${successCount} 个应用`);
  console.log(`更新失败: ${failCount} 个应用`);
  
  if (notFoundApps.length > 0) {
    console.log(`\n未找到的 ${notFoundApps.length} 个应用:`);
    notFoundApps.forEach(app => console.log(`- ${app}`));
  }
  
  console.log('\n=== 分类统计 ===');
  Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} 个应用`);
    });
}

// 执行更新
updateToolCategories().catch(console.error);
