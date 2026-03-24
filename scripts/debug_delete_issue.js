// 直接检查删除问题的根本原因
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function debugDeleteIssue() {
  console.log('=== 调试删除问题根本原因 ===');
  
  try {
    // 1. 检查当前数据库状态
    console.log('1. 检查当前数据库状态...');
    const { data: allTools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(10);
    
    if (toolsError) {
      console.error('❌ 查询工具失败:', toolsError);
      return;
    }
    
    console.log(`✅ 数据库中最新10个工具:`);
    allTools?.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (ID: ${tool.id}, 状态: ${tool.status})`);
      console.log(`   更新时间: ${new Date(tool.updated_at).toLocaleString()}`);
    });
    
    // 2. 模拟前端删除操作，但这次不实际删除
    console.log('\n2. 模拟前端删除流程...');
    
    if (allTools && allTools.length > 0) {
      const testTool = allTools[0];
      console.log(`选择测试工具: ${testTool.name}`);
      
      // 检查RLS策略
      console.log('检查删除权限...');
      
      // 尝试获取当前用户信息
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.log('⚠️ 无法获取用户信息:', userError.message);
      } else if (user) {
        console.log('✅ 当前用户:', user.email || user.id);
      } else {
        console.log('⚠️ 未检测到登录用户');
      }
      
      // 3. 检查是否有RLS策略影响
      console.log('\n3. 检查RLS策略...');
      
      // 尝试查询一个工具的详细信息
      const { data: toolDetail, error: detailError } = await supabase
        .from('tools')
        .select('*')
        .eq('id', testTool.id)
        .single();
      
      if (detailError) {
        console.error('❌ 查询工具详情失败:', detailError);
        if (detailError.code === 'PGRST116') {
          console.log('可能原因: 工具不存在或无权访问');
        }
      } else {
        console.log('✅ 可以正常查询工具详情');
        console.log(`工具状态: ${toolDetail.status}`);
        
        // 如果状态不是active/approved，前端可能不显示
        if (toolDetail.status !== 'active' && toolDetail.status !== 'approved') {
          console.log('💡 注意: 工具状态不是active/approved，可能影响前端显示');
        }
      }
      
      // 4. 检查前端查询条件
      console.log('\n4. 检查前端查询条件...');
      
      const { data: frontendTools, error: frontendError } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('view_count', { ascending: false });
      
      if (frontendError) {
        console.error('❌ 前端查询失败:', frontendError);
      } else {
        console.log(`✅ 前端将获取到 ${frontendTools?.length || 0} 个工具`);
        
        // 检查测试工具是否在前端结果中
        const testInFrontend = frontendTools?.find(tool => tool.id === testTool.id);
        if (testInFrontend) {
          console.log(`✅ 测试工具 "${testTool.name}" 在前端数据中`);
        } else {
          console.log(`❌ 测试工具 "${testTool.name}" 不在前端数据中`);
          console.log('可能原因:');
          console.log('- 状态不是approved或active');
          console.log('- 被其他条件过滤');
        }
      }
      
      // 5. 实际执行一次删除测试
      console.log('\n5. 执行实际删除测试...');
      console.log(`将要删除: ${testTool.name} (ID: ${testTool.id})`);
      
      const { error: deleteError, data: deleteData } = await supabase
        .from('tools')
        .delete()
        .eq('id', testTool.id)
        .select();
      
      if (deleteError) {
        console.error('❌ 删除测试失败:', deleteError);
        console.log('错误详情:', {
          code: deleteError.code,
          message: deleteError.message,
          details: deleteError.details
        });
        
        // 根据错误代码分析问题
        switch (deleteError.code) {
          case '42501':
            console.log('🔍 问题诊断: RLS策略阻止删除');
            console.log('解决方案: 检查tools表的DELETE权限RLS策略');
            break;
          case '23503':
            console.log('🔍 问题诊断: 外键约束');
            console.log('解决方案: 检查是否有其他表引用此工具');
            break;
          case 'PGRST116':
            console.log('🔍 问题诊断: 工具不存在');
            console.log('解决方案: 确认工具ID正确');
            break;
          default:
            console.log('🔍 问题诊断: 其他数据库错误');
        }
      } else {
        console.log('✅ 删除测试成功');
        console.log('删除的数据:', deleteData);
        
        // 立即验证删除结果
        console.log('\n6. 验证删除结果...');
        
        const { data: verifyData, error: verifyError } = await supabase
          .from('tools')
          .select('id, name')
          .eq('id', testTool.id);
        
        if (verifyError) {
          console.error('❌ 验证查询失败:', verifyError);
        } else if (verifyData && verifyData.length > 0) {
          console.log('❌ 删除验证失败 - 工具仍然存在');
          verifyData.forEach(tool => {
            console.log(`- ${tool.name} (ID: ${tool.id})`);
          });
        } else {
          console.log('✅ 删除验证成功 - 工具已不存在');
        }
        
        // 检查前端数据是否更新
        console.log('\n7. 检查前端数据更新...');
        
        const { data: newFrontendData, error: newFrontendError } = await supabase
          .from('tools')
          .select('*')
          .in('status', ['approved', 'active'])
          .order('view_count', { ascending: false });
        
        if (!newFrontendError && newFrontendData) {
          const deletedInNewFrontend = newFrontendData.find(tool => tool.id === testTool.id);
          if (deletedInNewFrontend) {
            console.log('❌ 被删除的工具仍在新前端数据中!');
          } else {
            console.log('✅ 被删除的工具不在新前端数据中');
            console.log(`前端工具数量: ${newFrontendData.length} (之前: ${frontendTools?.length || 0})`);
          }
        }
      }
    }
    
    console.log('\n=== 调试完成 ===');
    console.log('如果删除功能仍然不工作，请检查:');
    console.log('1. 浏览器开发者工具的Network标签页');
    console.log('2. Supabase Dashboard中的RLS策略');
    console.log('3. 数据库表的外键约束');
    console.log('4. 前端代码的数据获取逻辑');
    
  } catch (error) {
    console.error('❌ 调试过程出错:', error);
  }
}

debugDeleteIssue().catch(console.error);
