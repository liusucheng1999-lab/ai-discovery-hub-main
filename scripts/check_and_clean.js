// 检查categories表并清理数据
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkAndClean() {
  console.log('检查categories表...');
  
  try {
    // 1. 检查categories表中有哪些值
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (catError) {
      console.error('查询categories失败:', catError);
      return;
    }
    
    console.log('categories表中的值:');
    categories?.forEach(cat => {
      console.log(`- ${cat.id}: ${cat.name}`);
    });
    
    // 2. 使用第一个存在的category值更新所有tools
    if (categories && categories.length > 0) {
      const firstCategory = categories[0].id;
      console.log(`使用 ${firstCategory} 作为默认category值...`);
      
      const { error: updateError } = await supabase
        .from('tools')
        .update({ category: firstCategory })
        .neq('category', firstCategory);
      
      if (updateError) {
        console.error('更新category失败:', updateError);
      } else {
        console.log('✅ category字段已统一设置');
      }
    }
    
    // 3. 验证结果
    const { data: sample, error: sampleError } = await supabase
      .from('tools')
      .select('name, category, pricing_type, main_category, sub_category')
      .limit(3);
    
    if (!sampleError && sample) {
      console.log('更新后的样本数据:');
      sample.forEach(tool => {
        console.log(`- ${tool.name}: category=${tool.category}, pricing_type=${tool.pricing_type}, main=${tool.main_category}, sub=${tool.sub_category}`);
      });
    }
    
    console.log('✅ 检查和清理完成！');
    
  } catch (error) {
    console.error('检查和清理失败:', error);
  }
}

checkAndClean().catch(console.error);
