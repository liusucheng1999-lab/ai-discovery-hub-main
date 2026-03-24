// 直接测试删除现有工具
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function testRealDelete() {
  console.log('测试真实删除功能...');
  
  try {
    // 1. 找一个可以删除的工具（选择一个测试工具）
    const { data: testTool, error: findError } = await supabase
      .from('tools')
      .select('*')
      .eq('name', 'HelloClaww')
      .single();
    
    if (findError) {
      console.error('查找测试工具失败:', findError);
      return;
    }
    
    console.log('找到测试工具:', testTool.name, 'ID:', testTool.id);
    
    // 2. 尝试删除
    console.log('尝试删除工具...');
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .eq('id', testTool.id);
    
    if (deleteError) {
      console.error('❌ 删除失败:', deleteError);
      console.log('错误详情:', deleteError.details);
      console.log('错误代码:', deleteError.code);
      
      // 分析错误类型
      if (deleteError.code === '42501') {
        console.log('原因: 权限不足 - RLS策略阻止删除');
      } else if (deleteError.code === '23503') {
        console.log('原因: 外键约束 - 其他表引用此记录');
      } else if (deleteError.code === '23514') {
        console.log('原因: 检查约束 - 违反数据完整性');
      } else {
        console.log('原因: 其他数据库错误');
      }
    } else {
      console.log('✅ 删除成功！');
      
      // 验证删除
      const { data: verifyDelete, error: verifyError } = await supabase
        .from('tools')
        .select('name')
        .eq('id', testTool.id)
        .single();
      
      if (verifyError && verifyError.code === 'PGRST116') {
        console.log('✅ 确认删除成功 - 工具已不存在');
      } else {
        console.log('⚠️ 删除可能未完全成功');
      }
    }
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

testRealDelete().catch(console.error);
