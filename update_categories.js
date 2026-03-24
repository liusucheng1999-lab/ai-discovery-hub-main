import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function updateCategories() {
  try {
    console.log('=== 更新主分类名称为标准分类体系 ===');
    
    // 标准分类映射
    const categoryUpdates = [
      { id: 'image', name: '视觉', icon: '🎨' },
      { id: 'search', name: '工具', icon: '🔍' },
      { id: 'ai_agent', name: '职场', icon: '🤖' }
    ];
    
    for (const update of categoryUpdates) {
      const { error } = await supabase
        .from('main_categories')
        .update({ 
          name: update.name,
          icon: update.icon
        })
        .eq('id', update.id);
      
      if (error) {
        console.error(`更新 ${update.id} 失败:`, error.message);
      } else {
        console.log(`✅ 更新 ${update.id} 为 "${update.name}"`);
      }
    }
    
    // 验证更新结果
    console.log('\n=== 验证更新结果 ===');
    const { data: categories, error } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    
    categories.forEach(cat => {
      console.log(`ID: ${cat.id}, 名称: ${cat.name}, 图标: ${cat.icon}, 排序: ${cat.sort_order}`);
    });
    
    console.log('\n✅ 分类名称更新完成！');
    
  } catch (error) {
    console.error('更新分类失败:', error.message);
  }
}

updateCategories();
