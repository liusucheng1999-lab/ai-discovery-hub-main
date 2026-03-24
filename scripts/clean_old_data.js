// 清理数据库中的旧版分类数据和价格类型数据
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function cleanOldData() {
  console.log('开始清理旧版分类数据和价格类型数据...');
  
  try {
    // 1. 清理所有工具的category字段（旧版分类）
    console.log('正在清理category字段...');
    const { error: categoryError } = await supabase
      .from('tools')
      .update({ category: null })
      .not('category', 'is', null);
    
    if (categoryError) {
      console.error('清理category字段失败:', categoryError);
    } else {
      console.log('✅ category字段清理完成');
    }
    
    // 2. 清理所有工具的pricing_type字段（价格类型）
    console.log('正在清理pricing_type字段...');
    const { error: pricingError } = await supabase
      .from('tools')
      .update({ pricing_type: null })
      .not('pricing_type', 'is', null);
    
    if (pricingError) {
      console.error('清理pricing_type字段失败:', pricingError);
    } else {
      console.log('✅ pricing_type字段清理完成');
    }
    
    // 3. 验证清理结果
    console.log('正在验证清理结果...');
    const { data: toolsData, error: verifyError } = await supabase
      .from('tools')
      .select('id, name, main_category, sub_category, category, pricing_type')
      .limit(10);
    
    if (verifyError) {
      console.error('验证失败:', verifyError);
    } else {
      console.log('验证结果（前10个工具）:');
      toolsData?.forEach(tool => {
        console.log(`- ${tool.name}:`);
        console.log(`  main_category: ${tool.main_category}`);
        console.log(`  sub_category: ${tool.sub_category}`);
        console.log(`  category: ${tool.category}`);
        console.log(`  pricing_type: ${tool.pricing_type}`);
        console.log('');
      });
    }
    
    // 4. 统计当前数据状态
    const { data: allTools, error: statsError } = await supabase
      .from('tools')
      .select('main_category, sub_category');
    
    if (!statsError && allTools) {
      const stats = {
        withMainCategory: allTools.filter(t => t.main_category).length,
        withSubCategory: allTools.filter(t => t.sub_category).length,
        total: allTools.length
      };
      
      console.log('=== 数据统计 ===');
      console.log(`总工具数: ${stats.total}`);
      console.log(`有主分类的: ${stats.withMainCategory}`);
      console.log(`有二级分类的: ${stats.withSubCategory}`);
      console.log(`分类覆盖率: ${((stats.withMainCategory / stats.total) * 100).toFixed(1)}%`);
    }
    
    console.log('✅ 数据清理完成！');
    
  } catch (error) {
    console.error('清理过程中出错:', error);
  }
}

// 执行清理
cleanOldData().catch(console.error);
