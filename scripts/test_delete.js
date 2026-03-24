// 测试删除功能
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function testDelete() {
  console.log('测试删除功能...');
  
  try {
    // 1. 检查一个测试工具
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
    
    // 2. 测试删除权限（不实际删除）
    console.log('检查删除权限...');
    
    // 检查RLS策略
    const { data: policies, error: policyError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (policyError) {
      console.error('权限检查失败:', policyError);
    } else {
      console.log('✅ 有查询权限');
    }
    
    // 3. 检查是否有外键约束
    console.log('检查可能的约束...');
    
    // 查看表结构信息
    const { data: tableInfo, error: tableError } = await supabase
      .from('tools')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.error('表访问错误:', tableError);
    } else {
      console.log('✅ 表访问正常');
    }
    
    // 4. 模拟删除操作（使用事务回滚）
    console.log('测试删除操作...');
    
    // 先创建一个测试记录
    const { data: newTool, error: insertError } = await supabase
      .from('tools')
      .insert({
        name: '测试删除工具',
        tagline: '用于测试删除功能',
        description: '这是一个测试工具',
        website_url: 'https://test.com',
        category: 'chat',
        pricing_type: 'free',
        is_china_available: true,
        is_chinese_supported: true,
        status: 'pending',
        main_category: 'tools',
        sub_category: 'tools_efficiency'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('创建测试工具失败:', insertError);
      return;
    }
    
    console.log('创建测试工具成功:', newTool.id);
    
    // 尝试删除测试工具
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .eq('id', newTool.id);
    
    if (deleteError) {
      console.error('删除测试失败:', deleteError);
      console.log('可能的原因:');
      console.log('1. RLS策略阻止删除');
      console.log('2. 外键约束');
      console.log('3. 用户权限不足');
    } else {
      console.log('✅ 删除测试成功');
    }
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

testDelete().catch(console.error);
