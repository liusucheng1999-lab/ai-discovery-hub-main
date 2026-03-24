import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function updateFinalCategories() {
  try {
    console.log('=== 更新为最终标准分类体系 ===');
    
    // 最终标准分类体系
    const finalCategories = [
      { id: 'chat', name: '对话', icon: '💬', sort_order: 1 },
      { id: 'writing', name: '写作', icon: '✍️', sort_order: 2 },
      { id: 'visual', name: '视觉', icon: '🎨', sort_order: 3 },
      { id: 'audio', name: '音频', icon: '🎵', sort_order: 4 },
      { id: 'coding', name: '编程', icon: '💻', sort_order: 5 },
      { id: 'office', name: '办公', icon: '📊', sort_order: 6 },
      { id: 'tools', name: '工具', icon: '🔍', sort_order: 7 },
      { id: 'career', name: '职场', icon: '🤖', sort_order: 8 }
    ];
    
    // 标准子分类体系
    const finalSubCategories = [
      // 对话类子分类
      { id: 'chat_domestic', name: '国产模型', main_category_id: 'chat', sort_order: 1 },
      { id: 'chat_overseas', name: '海外模型', main_category_id: 'chat', sort_order: 2 },
      { id: 'chat_general', name: '通用对话', main_category_id: 'chat', sort_order: 3 },
      { id: 'chat_fun', name: '趣味聊天', main_category_id: 'chat', sort_order: 4 },
      
      // 写作类子分类
      { id: 'writing_copy', name: '文案创作', main_category_id: 'writing', sort_order: 1 },
      { id: 'writing_academic', name: '论文学术', main_category_id: 'writing', sort_order: 2 },
      { id: 'writing_novel', name: '小说网文', main_category_id: 'writing', sort_order: 3 },
      { id: 'writing_document', name: '文档解析', main_category_id: 'writing', sort_order: 4 },
      
      // 视觉类子分类
      { id: 'visual_image_gen', name: '图像生成', main_category_id: 'visual', sort_order: 1 },
      { id: 'visual_image_process', name: '图像处理', main_category_id: 'visual', sort_order: 2 },
      { id: 'visual_creative', name: '创意设计', main_category_id: 'visual', sort_order: 3 },
      { id: 'visual_video', name: '视频数字人', main_category_id: 'visual', sort_order: 4 },
      
      // 音频类子分类
      { id: 'audio_music', name: '音乐生成', main_category_id: 'audio', sort_order: 1 },
      { id: 'audio_voice', name: '配音克隆', main_category_id: 'audio', sort_order: 2 },
      { id: 'audio_transcribe', name: '语音转写', main_category_id: 'audio', sort_order: 3 },
      { id: 'audio_edit', name: '音频编辑', main_category_id: 'audio', sort_order: 4 },
      
      // 编程类子分类
      { id: 'coding_code', name: '代码编写', main_category_id: 'coding', sort_order: 1 },
      { id: 'coding_ai', name: 'AI 工程', main_category_id: 'coding', sort_order: 2 },
      { id: 'coding_dev', name: '开发工具', main_category_id: 'coding', sort_order: 3 },
      { id: 'coding_agent', name: '智能体开发', main_category_id: 'coding', sort_order: 4 },
      
      // 办公类子分类
      { id: 'office_ppt', name: 'PPT 演示', main_category_id: 'office', sort_order: 1 },
      { id: 'office_doc', name: '文档协同', main_category_id: 'office', sort_order: 2 },
      { id: 'office_data', name: '数据表格', main_category_id: 'office', sort_order: 3 },
      { id: 'office_mind', name: '思维导图', main_category_id: 'office', sort_order: 4 },
      
      // 工具类子分类
      { id: 'tools_search', name: '智能搜索', main_category_id: 'tools', sort_order: 1 },
      { id: 'tools_efficiency', name: '效率工具', main_category_id: 'tools', sort_order: 2 },
      { id: 'tools_learn', name: '学习科研', main_category_id: 'tools', sort_order: 3 },
      { id: 'tools_niche', name: '小众工具', main_category_id: 'tools', sort_order: 4 },
      
      // 职场类子分类
      { id: 'career_job', name: '求职辅助', main_category_id: 'career', sort_order: 1 },
      { id: 'career_legal', name: '法律合规', main_category_id: 'career', sort_order: 2 },
      { id: 'career_work', name: '职场工具', main_category_id: 'career', sort_order: 3 }
    ];
    
    // 1. 更新主分类
    console.log('更新主分类...');
    for (const category of finalCategories) {
      const { error } = await supabase
        .from('main_categories')
        .upsert({
          id: category.id,
          name: category.name,
          icon: category.icon,
          sort_order: category.sort_order,
          description: `${category.name}类AI工具`
        });
      
      if (error) {
        console.error(`更新主分类 ${category.name} 失败:`, error.message);
      } else {
        console.log(`✅ 更新主分类: ${category.name}`);
      }
    }
    
    // 2. 更新子分类
    console.log('\n更新子分类...');
    for (const subCategory of finalSubCategories) {
      const { error } = await supabase
        .from('sub_categories')
        .upsert({
          id: subCategory.id,
          name: subCategory.name,
          main_category_id: subCategory.main_category_id,
          sort_order: subCategory.sort_order,
          description: `${subCategory.name}相关工具`
        });
      
      if (error) {
        console.error(`更新子分类 ${subCategory.name} 失败:`, error.message);
      } else {
        console.log(`✅ 更新子分类: ${subCategory.name}`);
      }
    }
    
    // 3. 删除不需要的分类
    console.log('\n清理旧分类...');
    
    // 删除旧的主分类
    const { error: deleteMainError } = await supabase
      .from('main_categories')
      .delete()
      .not('id', 'in', ['chat', 'writing', 'visual', 'audio', 'coding', 'office', 'tools', 'career']);
    
    if (deleteMainError) {
      console.error('删除旧主分类失败:', deleteMainError.message);
    } else {
      console.log('✅ 清理旧主分类完成');
    }
    
    // 删除旧的子分类
    const validSubIds = finalSubCategories.map(sub => sub.id);
    const { error: deleteSubError } = await supabase
      .from('sub_categories')
      .delete()
      .not('id', 'in', validSubIds);
    
    if (deleteSubError) {
      console.error('删除旧子分类失败:', deleteSubError.message);
    } else {
      console.log('✅ 清理旧子分类完成');
    }
    
    // 4. 验证结果
    console.log('\n=== 验证更新结果 ===');
    const { data: mainCategories } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    const { data: subCategories } = await supabase
      .from('sub_categories')
      .select('*')
      .order('main_category_id, sort_order');
    
    console.log('主分类:');
    mainCategories?.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name} (${cat.id})`);
    });
    
    console.log('\n子分类:');
    subCategories?.forEach(sub => {
      console.log(`  ${sub.main_category_id} -> ${sub.name} (${sub.id})`);
    });
    
    console.log('\n✅ 分类体系更新完成！');
    
  } catch (error) {
    console.error('更新分类失败:', error.message);
  }
}

updateFinalCategories();
