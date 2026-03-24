// 修复删除功能 - 创建一个简化版本
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

// 模拟前端删除逻辑
async function testDeleteLogic() {
  console.log('测试删除逻辑...');
  
  // 模拟工具数据
  const mockTool = {
    id: '1773211024409',
    name: '测试工具',
    main_category: 'tools',
    sub_category: 'tools_efficiency'
  };
  
  // 模拟登录状态
  const isLoggedIn = true;
  
  console.log('1. 检查登录状态:', isLoggedIn);
  
  if (!isLoggedIn) {
    console.log('❌ 用户未登录');
    return;
  }
  
  console.log('✅ 用户已登录');
  
  // 模拟确认对话框
  const userConfirmed = true; // 假设用户确认
  
  if (!userConfirmed) {
    console.log('❌ 用户取消删除');
    return;
  }
  
  console.log('✅ 用户确认删除');
  
  try {
    console.log('2. 正在删除工具...');
    console.log('工具ID:', mockTool.id);
    console.log('工具名称:', mockTool.name);
    
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', mockTool.id);

    if (error) {
      console.error('❌ 删除失败:', error);
      console.log('错误详情:', error.details);
      console.log('错误代码:', error.code);
      
      // 分析错误
      if (error.code === 'PGRST116') {
        console.log('可能原因: 工具不存在');
      } else if (error.code === '42501') {
        console.log('可能原因: 权限不足');
      } else if (error.code === '23503') {
        console.log('可能原因: 外键约束');
      }
      
      return;
    }

    console.log('✅ 删除成功');
    
    // 模拟toast显示
    console.log('3. 显示成功提示');
    console.log('标题: 删除成功');
    console.log('描述: 工具已被删除');
    
    // 模拟页面刷新
    console.log('4. 准备刷新页面...');
    setTimeout(() => {
      console.log('✅ 页面刷新完成');
    }, 1000);
    
  } catch (err) {
    console.error('❌ 删除过程出错:', err);
  }
}

// 测试实际的删除权限
async function testDeletePermission() {
  console.log('\n测试删除权限...');
  
  try {
    // 尝试删除一个不存在的工具来测试权限
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', 'non-existent-id');
    
    if (error) {
      console.log('权限测试结果:');
      if (error.code === '42501') {
        console.log('❌ 删除权限不足 - 需要检查RLS策略');
      } else if (error.code === 'PGRST116') {
        console.log('✅ 有删除权限 - 工具不存在是正常的');
      } else {
        console.log('⚠️ 其他错误:', error);
      }
    } else {
      console.log('✅ 删除权限正常');
    }
    
  } catch (err) {
    console.error('权限测试失败:', err);
  }
}

async function main() {
  await testDeleteLogic();
  await testDeletePermission();
}

main().catch(console.error);
