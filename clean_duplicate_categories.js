import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function cleanDuplicateCategories() {
  try {
    console.log('=== 清理重复分类 ===');
    
    // 需要保留的标准分类ID
    const standardMainIds = ['chat', 'writing', 'visual', 'audio', 'coding', 'office', 'tools', 'career'];
    const standardSubIds = [
      'chat_domestic', 'chat_overseas', 'chat_general', 'chat_fun',
      'writing_copy', 'writing_academic', 'writing_novel', 'writing_document',
      'visual_image_gen', 'visual_image_process', 'visual_creative', 'visual_video',
      'audio_music', 'audio_voice', 'audio_transcribe', 'audio_edit',
      'coding_code', 'coding_ai', 'coding_dev', 'coding_agent',
      'office_ppt', 'office_doc', 'office_data', 'office_mind',
      'tools_search', 'tools_efficiency', 'tools_learn', 'tools_niche',
      'career_job', 'career_legal', 'career_work'
    ];
    
    // 删除重复的主分类
    console.log('删除重复的主分类...');
    const { data: mainCategories } = await supabase
      .from('main_categories')
      .select('*');
    
    const duplicateMainCategories = mainCategories?.filter(cat => !standardMainIds.includes(cat.id)) || [];
    
    for (const cat of duplicateMainCategories) {
      const { error } = await supabase
        .from('main_categories')
        .delete()
        .eq('id', cat.id);
      
      if (error) {
        console.error(`删除主分类 ${cat.name} 失败:`, error.message);
      } else {
        console.log(`✅ 删除主分类: ${cat.name} (${cat.id})`);
      }
    }
    
    // 删除重复的子分类
    console.log('\n删除重复的子分类...');
    const { data: subCategories } = await supabase
      .from('sub_categories')
      .select('*');
    
    const duplicateSubCategories = subCategories?.filter(sub => !standardSubIds.includes(sub.id)) || [];
    
    for (const sub of duplicateSubCategories) {
      const { error } = await supabase
        .from('sub_categories')
        .delete()
        .eq('id', sub.id);
      
      if (error) {
        console.error(`删除子分类 ${sub.name} 失败:`, error.message);
      } else {
        console.log(`✅ 删除子分类: ${sub.name} (${sub.id})`);
      }
    }
    
    // 验证清理结果
    console.log('\n=== 验证清理结果 ===');
    const { data: finalMainCategories } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    const { data: finalSubCategories } = await supabase
      .from('sub_categories')
      .select('*')
      .order('main_category_id, sort_order');
    
    console.log('最终主分类:');
    finalMainCategories?.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name} (${cat.id})`);
    });
    
    console.log('\n最终子分类:');
    finalSubCategories?.forEach(sub => {
      console.log(`  ${sub.main_category_id} -> ${sub.name} (${sub.id})`);
    });
    
    console.log('\n✅ 分类清理完成！');
    
  } catch (error) {
    console.error('清理分类失败:', error.message);
  }
}

cleanDuplicateCategories();
