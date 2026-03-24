// 直接通过Supabase执行SQL清理
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function executeSQLClean() {
  console.log('正在执行SQL清理...');
  
  try {
    // 使用RPC执行SQL（如果Supabase支持）
    // 或者直接更新数据为默认值而不是null
    
    // 1. 将category设置为默认值
    console.log('正在设置category默认值...');
    const { error: categoryError } = await supabase
      .from('tools')
      .update({ category: 'other' })
      .neq('category', 'other');
    
    if (categoryError) {
      console.error('设置category失败:', categoryError);
    } else {
      console.log('✅ category字段已设置为默认值');
    }
    
    // 2. 将pricing_type设置为默认值
    console.log('正在设置pricing_type默认值...');
    const { error: pricingError } = await supabase
      .from('tools')
      .update({ pricing_type: 'free' })
      .neq('pricing_type', 'free');
    
    if (pricingError) {
      console.error('设置pricing_type失败:', pricingError);
    } else {
      console.log('✅ pricing_type字段已设置为默认值');
    }
    
    // 3. 验证结果
    const { data: sample, error: sampleError } = await supabase
      .from('tools')
      .select('name, category, pricing_type, main_category, sub_category')
      .limit(5);
    
    if (!sampleError && sample) {
      console.log('样本数据:');
      sample.forEach(tool => {
        console.log(`- ${tool.name}: category=${tool.category}, pricing_type=${tool.pricing_type}, main=${tool.main_category}, sub=${tool.sub_category}`);
      });
    }
    
    console.log('✅ SQL清理完成！');
    
  } catch (error) {
    console.error('SQL清理失败:', error);
  }
}

executeSQLClean().catch(console.error);
