// 检查当前数据库中的所有二级分类
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkAllCategories() {
  try {
    // 查询所有主分类
    const { data: mainCategories, error: mainError } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');
    
    if (mainError) {
      console.error('查询主分类失败:', mainError);
      return;
    }
    
    console.log('=== 主分类 ===');
    mainCategories.forEach(cat => {
      console.log(`${cat.id}: ${cat.name} (${cat.icon})`);
    });
    
    // 查询所有子分类
    const { data: subCategories, error: subError } = await supabase
      .from('sub_categories')
      .select('*')
      .order('main_category_id, sort_order');
    
    if (subError) {
      console.error('查询子分类失败:', subError);
      return;
    }
    
    console.log('\n=== 子分类 ===');
    const groupedSubCategories = {};
    
    subCategories.forEach(sub => {
      if (!groupedSubCategories[sub.main_category_id]) {
        groupedSubCategories[sub.main_category_id] = [];
      }
      groupedSubCategories[sub.main_category_id].push(sub);
    });
    
    Object.entries(groupedSubCategories).forEach(([mainCatId, subs]) => {
      const mainCat = mainCategories.find(cat => cat.id === mainCatId);
      console.log(`\n${mainCat ? mainCat.name : mainCatId}:`);
      subs.forEach(sub => {
        console.log(`  - ${sub.id}: ${sub.name}`);
      });
    });
    
  } catch (error) {
    console.error('检查分类失败:', error);
  }
}

checkAllCategories();
