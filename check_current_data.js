import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co',
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkCurrentData() {
  try {
    console.log('=== 检查当前数据库状态 ===');
    
    // 检查主分类
    const { data: mainCategories } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    console.log('主分类:');
    mainCategories?.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name} (${cat.id})`);
    });
    
    // 检查工具数量统计
    console.log('\n=== 工具数量统计 ===');
    const { data: tools } = await supabase
      .from('tools')
      .select('main_category, sub_category')
      .in('status', ['approved', 'active']);
    
    const stats = {};
    
    tools?.forEach(tool => {
      if (!stats[tool.main_category]) {
        stats[tool.main_category] = {};
      }
      if (!stats[tool.main_category][tool.sub_category]) {
        stats[tool.main_category][tool.sub_category] = 0;
      }
      stats[tool.main_category][tool.sub_category]++;
    });
    
    Object.keys(stats).forEach(mainCat => {
      const mainCatName = mainCategories?.find(c => c.id === mainCat)?.name || mainCat;
      console.log(`\n${mainCatName} (${mainCat}): ${Object.values(stats[mainCat]).reduce((a, b) => a + b, 0)} 个`);
      Object.keys(stats[mainCat]).forEach(subCat => {
        console.log(`  - ${subCat}: ${stats[mainCat][subCat]} 个`);
      });
    });
    
    console.log(`\n总工具数: ${tools?.length || 0}`);
    
  } catch (error) {
    console.error('检查失败:', error.message);
  }
}

checkCurrentData();
