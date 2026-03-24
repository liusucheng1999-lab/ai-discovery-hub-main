import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function updateToolsCategories() {
  try {
    console.log('=== 更新工具数据分类ID ===');
    
    // 旧的分类ID到新的分类ID映射
    const mainCategoryMapping = {
      'image': 'visual',
      'search': 'tools', 
      'ai_agent': 'career'
    };
    
    const subCategoryMapping = {
      // 写作类
      'writing_marketing': 'writing_copy',
      
      // 视觉类
      'image_generation': 'visual_image_gen',
      'image_design': 'visual_creative',
      'image_editing': 'visual_image_process',
      'image_recognition': 'visual_image_process',
      'video_generation': 'visual_video',
      
      // 音频类
      'audio_synthesis': 'audio_voice',
      'audio_composition': 'audio_music',
      
      // 编程类
      'coding_generation': 'coding_code',
      'coding_documentation': 'coding_ai',
      'coding_testing': 'coding_dev',
      
      // 对话类
      'chat_professional': 'chat_general',
      'chat_companion': 'chat_fun',
      'chat_multimodal': 'chat_general',
      
      // 办公类
      'office_document': 'office_doc',
      'office_presentation': 'office_ppt',
      'office_meeting': 'office_doc',
      
      // 工具类
      'search_smart': 'tools_search',
      'search_academic': 'tools_learn',
      'search_research': 'tools_learn',
      'tools_model': 'tools_efficiency',
      'tools_prompt': 'tools_efficiency',
      'tools_framework': 'coding_dev',
      'tools_detection': 'tools_niche',
      
      // 职场类
      'ai_platform': 'coding_agent',
      'ai_plugins': 'tools_efficiency',
      'ai_other': 'tools_niche'
    };
    
    // 获取所有需要更新的工具
    const { data: tools, error: fetchError } = await supabase
      .from('tools')
      .select('id, name, main_category, sub_category')
      .in('status', ['approved', 'active']);
    
    if (fetchError) throw fetchError;
    
    console.log(`找到 ${tools.length} 个工具需要检查`);
    
    let updateCount = 0;
    let skipCount = 0;
    
    for (const tool of tools) {
      let needsUpdate = false;
      const updates = {};
      
      // 检查主分类是否需要更新
      if (mainCategoryMapping[tool.main_category]) {
        updates.main_category = mainCategoryMapping[tool.main_category];
        needsUpdate = true;
      }
      
      // 检查子分类是否需要更新
      if (subCategoryMapping[tool.sub_category]) {
        updates.sub_category = subCategoryMapping[tool.sub_category];
        needsUpdate = true;
      }
      
      // 执行更新
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('tools')
          .update(updates)
          .eq('id', tool.id);
        
        if (updateError) {
          console.error(`更新工具 ${tool.name} 失败:`, updateError.message);
        } else {
          updateCount++;
          console.log(`✅ 更新工具: ${tool.name}`);
          console.log(`   主分类: ${tool.main_category} -> ${updates.main_category || tool.main_category}`);
          console.log(`   子分类: ${tool.sub_category} -> ${updates.sub_category || tool.sub_category}`);
        }
      } else {
        skipCount++;
      }
    }
    
    console.log(`\n=== 更新完成 ===`);
    console.log(`更新工具数量: ${updateCount}`);
    console.log(`跳过工具数量: ${skipCount}`);
    
    // 验证更新结果
    console.log('\n=== 验证分类分布 ===');
    const { data: categoryStats } = await supabase
      .from('tools')
      .select('main_category, sub_category')
      .in('status', ['approved', 'active']);
    
    const stats = {};
    
    categoryStats.forEach(tool => {
      if (!stats[tool.main_category]) {
        stats[tool.main_category] = {};
      }
      if (!stats[tool.main_category][tool.sub_category]) {
        stats[tool.main_category][tool.sub_category] = 0;
      }
      stats[tool.main_category][tool.sub_category]++;
    });
    
    Object.keys(stats).forEach(mainCat => {
      console.log(`\n${mainCat}:`);
      Object.keys(stats[mainCat]).forEach(subCat => {
        console.log(`  ${subCat}: ${stats[mainCat][subCat]} 个工具`);
      });
    });
    
    console.log('\n✅ 工具分类更新完成！');
    
  } catch (error) {
    console.error('更新工具分类失败:', error.message);
  }
}

updateToolsCategories();
