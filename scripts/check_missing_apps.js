// 检查tool.txt文件中未成功更新的应用
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
  
  lines.forEach((line, index) => {
    // 跳过标题行
    if (line.includes('一级分类,二级分类,应用名称')) {
      return;
    }
    
    // 解析格式: 主分类,子分类,应用名称
    const parts = line.split(',').map(part => part.trim());
    if (parts.length === 3) {
      const [mainCategory, subCategory, appName] = parts;
      
      // 映射到数据库的分类ID
      let mainCategoryId = mainCategory;
      let subCategoryId = subCategory;
      
      // 主分类映射
      switch (mainCategory) {
        case '对话':
          mainCategoryId = 'chat';
          break;
        case '写作':
          mainCategoryId = 'writing';
          break;
        case '视觉':
          mainCategoryId = 'visual';
          break;
        case '音频':
          mainCategoryId = 'audio';
          break;
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
        // 对话类
        case '国产模型':
          subCategoryId = 'chat_domestic';
          break;
        case '海外模型':
          subCategoryId = 'chat_overseas';
          break;
        case '趣味聊天':
          subCategoryId = 'chat_fun';
          break;
          
        // 写作类
        case '文案创作':
          subCategoryId = 'writing_copy';
          break;
        case '论文学术':
          subCategoryId = 'writing_academic';
          break;
        case '小说网文':
          subCategoryId = 'writing_novel';
          break;
        case '文档解析':
          subCategoryId = 'writing_document';
          break;
          
        // 视觉类
        case '图像生成':
          subCategoryId = 'visual_image_gen';
          break;
        case '图像处理':
          subCategoryId = 'visual_image_process';
          break;
        case '创意设计':
          subCategoryId = 'visual_creative';
          break;
        case '视频数字人':
          subCategoryId = 'visual_video';
          break;
          
        // 音频类
        case '音乐生成':
          subCategoryId = 'audio_music';
          break;
        case '配音克隆':
          subCategoryId = 'audio_voice';
          break;
        case '语音转写':
          subCategoryId = 'audio_transcribe';
          break;
        case '音频编辑':
          subCategoryId = 'audio_edit';
          break;
          
        // 编程类
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
          
        // 办公类
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
          
        // 工具类
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
          
        // 职场类
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
        sub_category: subCategoryId,
        original_main: mainCategory,
        original_sub: subCategory
      });
    }
  });
  
  return categoryMapping;
}

async function checkAndUpdateMissingApps() {
  console.log('检查tool.txt文件中未成功更新的应用...');
  
  // 解析tool.txt文件
  const toolCategoryMapping = parseToolFile('./tool.txt');
  console.log(`从tool.txt解析出 ${toolCategoryMapping.length} 个应用分类映射`);
  
  const notFoundApps = [];
  const foundApps = [];
  
  console.log('\n=== 检查应用是否存在 ===');
  
  for (const app of toolCategoryMapping) {
    try {
      // 查找应用
      const { data: existingApp, error: findError } = await supabase
        .from('tools')
        .select('*')
        .eq('name', app.name)
        .single();
      
      if (findError || !existingApp) {
        notFoundApps.push(app);
      } else {
        // 检查分类是否正确
        if (existingApp.main_category !== app.main_category || existingApp.sub_category !== app.sub_category) {
          console.log(`⚠️  ${app.name} 分类不匹配:`);
          console.log(`   数据库: ${existingApp.main_category}/${existingApp.sub_category}`);
          console.log(`   应该是: ${app.main_category}/${app.sub_category}`);
          
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
            console.error(`   更新失败:`, updateError);
          } else {
            console.log(`   ✓ 已更新`);
          }
        } else {
          foundApps.push(app);
        }
      }
      
    } catch (error) {
      console.error(`处理应用 ${app.name} 时出错:`, error);
    }
  }
  
  console.log('\n=== 检查结果 ===');
  console.log(`数据库中已正确分类: ${foundApps.length} 个应用`);
  console.log(`数据库中未找到: ${notFoundApps.length} 个应用`);
  
  if (notFoundApps.length > 0) {
    console.log('\n未找到的应用:');
    const groupedNotFound = {};
    
    notFoundApps.forEach(app => {
      const key = `${app.original_main}/${app.original_sub}`;
      if (!groupedNotFound[key]) {
        groupedNotFound[key] = [];
      }
      groupedNotFound[key].push(app.name);
    });
    
    Object.entries(groupedNotFound).forEach(([category, apps]) => {
      console.log(`\n${category}:`);
      apps.forEach(app => console.log(`  - ${app}`));
    });
  }
  
  // 统计当前数据库中的分类情况
  console.log('\n=== 当前数据库分类统计 ===');
  const { data: allTools, error: toolsError } = await supabase
    .from('tools')
    .select('main_category, sub_category')
    .not('main_category', 'is', null)
    .not('sub_category', 'is', null);
  
  if (!toolsError && allTools) {
    const currentStats = {};
    allTools.forEach(tool => {
      const key = `${tool.main_category}/${tool.sub_category}`;
      currentStats[key] = (currentStats[key] || 0) + 1;
    });
    
    Object.entries(currentStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} 个应用`);
      });
  }
}

// 执行检查
checkAndUpdateMissingApps().catch(console.error);
