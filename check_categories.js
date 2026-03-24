import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkCategories() {
  try {
    const { data: mainCategories, error } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    
    console.log('=== 当前主分类设置 ===');
    mainCategories.forEach(cat => {
      console.log(`ID: ${cat.id}, 名称: ${cat.name}, 图标: ${cat.icon}, 排序: ${cat.sort_order}`);
    });
    
    console.log('\n=== 检查是否需要更新分类名称 ===');
    const standardNames = {
      'writing': '写作',
      'image': '视觉', 
      'audio': '音频',
      'coding': '编程',
      'office': '办公',
      'chat': '对话',
      'search': '工具',
      'ai_agent': '职场'
    };
    
    let needsUpdate = false;
    mainCategories.forEach(cat => {
      const expectedName = standardNames[cat.id];
      if (expectedName && cat.name !== expectedName) {
        console.log(`需要更新: ${cat.id} 从 "${cat.name}" 改为 "${expectedName}"`);
        needsUpdate = true;
      }
    });
    
    if (!needsUpdate) {
      console.log('分类名称已是最新，无需更新');
    }
    
  } catch (error) {
    console.error('检查分类失败:', error.message);
  }
}

checkCategories();
