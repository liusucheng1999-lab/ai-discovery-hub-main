// 诊断删除功能问题
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function diagnoseDeleteIssue() {
  console.log('=== 诊断删除功能问题 ===');
  
  try {
    // 1. 检查当前数据库中的工具数量
    const { data: allTools, error: countError } = await supabase
      .from('tools')
      .select('id, name, status');
    
    if (countError) {
      console.error('❌ 查询工具失败:', countError);
      return;
    }
    
    console.log(`✅ 当前数据库中有 ${allTools?.length || 0} 个工具`);
    
    // 2. 检查RLS策略
    console.log('\n检查RLS策略...');
    
    // 尝试查询一个具体的工具
    const { data: testTool, error: testError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ 查询权限问题:', testError);
      if (testError.code === 'PGRST301') {
        console.log('可能原因: RLS策略阻止查询');
      }
    } else {
      console.log('✅ 查询权限正常');
    }
    
    // 3. 测试删除权限（使用一个测试工具）
    console.log('\n测试删除权限...');
    
    // 先找一个测试工具
    const { data: targetTool, error: findError } = await supabase
      .from('tools')
      .select('*')
      .eq('name', 'HelloClaww')
      .single();
    
    if (findError && findError.code === 'PGRST116') {
      console.log('HelloClaww 不存在，查找其他测试工具...');
      
      // 查找第一个可用的工具
      const { data: anyTool, error: anyError } = await supabase
        .from('tools')
        .select('*')
        .limit(1);
      
      if (anyError) {
        console.error('❌ 查找测试工具失败:', anyError);
        return;
      }
      
      if (anyTool && anyTool.length > 0) {
        console.log(`找到测试工具: ${anyTool[0].name} (ID: ${anyTool[0].id})`);
        
        // 测试删除这个工具
        console.log('测试删除权限...');
        const { error: deleteError } = await supabase
          .from('tools')
          .delete()
          .eq('id', anyTool[0].id);
        
        if (deleteError) {
          console.error('❌ 删除权限测试失败:', deleteError);
          console.log('错误代码:', deleteError.code);
          console.log('错误消息:', deleteError.message);
          
          // 分析具体错误
          switch (deleteError.code) {
            case '42501':
              console.log('🔍 诊断: RLS策略阻止删除 - 需要检查删除权限策略');
              break;
            case '23503':
              console.log('🔍 诊断: 外键约束 - 其他表引用此工具');
              break;
            case '23514':
              console.log('🔍 诊断: 检查约束 - 违反数据完整性规则');
              break;
            default:
              console.log('🔍 诊断: 其他数据库错误');
          }
        } else {
          console.log('✅ 删除权限正常 - 测试工具已被删除');
          console.log('⚠️  注意: 测试工具已被删除，如果这不是预期结果，请检查');
        }
      }
    } else if (targetTool) {
      console.log(`找到测试工具: ${targetTool.name} (ID: ${targetTool.id})`);
    }
    
    // 4. 检查admin_secure表（登录验证）
    console.log('\n检查管理员账户...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_secure')
      .select('*');
    
    if (adminError) {
      console.error('❌ 查询管理员表失败:', adminError);
    } else {
      console.log(`✅ 找到 ${adminData?.length || 0} 个管理员账户`);
      adminData?.forEach(admin => {
        console.log(`- ${admin.username} (管理员: ${admin.is_admin})`);
      });
    }
    
    console.log('\n=== 诊断完成 ===');
    console.log('如果删除功能仍然不工作，请检查:');
    console.log('1. 浏览器控制台的错误信息');
    console.log('2. 网络请求是否正常发送');
    console.log('3. 用户是否已正确登录');
    console.log('4. RLS策略配置是否正确');
    
  } catch (error) {
    console.error('❌ 诊断过程出错:', error);
  }
}

diagnoseDeleteIssue().catch(console.error);
