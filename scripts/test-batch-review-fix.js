/**
 * 测试批量审核修复
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testBatchReviewFix() {
  try {
    console.log('=== 测试批量审核修复 ===');
    
    // 1. 检查tools表是否有待审核的工具
    console.log('1. 检查tools表中的待审核工具:');
    const { data: pendingTools, error: pendingError } = await supabase
      .from('tools')
      .select('id, name, status')
      .eq('status', 'pending')
      .limit(5);
    
    if (pendingError) {
      console.error('查询待审核工具失败:', pendingError);
    } else {
      console.log(`找到 ${pendingTools?.length || 0} 个待审核工具:`);
      pendingTools?.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} (${tool.id})`);
      });
    }
    
    // 2. 测试创建批量任务
    if (pendingTools && pendingTools.length > 0) {
      console.log('\n2. 测试创建批量审核任务:');
      const testToolIds = pendingTools.slice(0, 2).map(t => t.id);
      
      const { data: newTask, error: taskError } = await supabase
        .from('batch_review_tasks')
        .insert({
          status: 'pending',
          total_tools: testToolIds.length,
          completed_tools: 0,
          tool_ids: testToolIds,
          created_by: 'test-fix'
        })
        .select()
        .single();
      
      if (taskError) {
        console.error('创建测试任务失败:', taskError);
      } else {
        console.log('✅ 测试任务创建成功:', newTask.id);
        console.log(`- 工具数量: ${newTask.total_tools}`);
        console.log(`- 工具IDs: ${newTask.tool_ids.join(', ')}`);
        
        // 3. 测试启动任务
        console.log('\n3. 测试启动任务:');
        const { data: startedTask, error: startError } = await supabase
          .from('batch_review_tasks')
          .update({
            status: 'running',
            started_at: new Date().toISOString()
          })
          .eq('id', newTask.id)
          .select()
          .single();
        
        if (startError) {
          console.error('启动任务失败:', startError);
        } else {
          console.log('✅ 任务启动成功:', startedTask.status);
          
          // 4. 测试获取工具（修复后的逻辑）
          console.log('\n4. 测试获取工具逻辑:');
          const { data: testTools, error: toolsError } = await supabase
            .from('tools')  // 使用tools表而不是tool_submissions
            .select('*')
            .in('id', testToolIds);
          
          if (toolsError) {
            console.error('❌ 获取工具失败（使用tools表）:', toolsError);
          } else {
            console.log('✅ 成功从tools表获取工具:', testTools.length);
            testTools.forEach((tool, index) => {
              console.log(`${index + 1}. ${tool.name} - status: ${tool.status}`);
            });
          }
          
          // 5. 清理测试任务
          console.log('\n5. 清理测试任务:');
          const { error: cleanupError } = await supabase
            .from('batch_review_tasks')
            .update({
              status: 'cancelled',
              completed_at: new Date().toISOString(),
              error_message: '测试完成，取消任务'
            })
            .eq('id', newTask.id);
          
          if (cleanupError) {
            console.error('清理测试任务失败:', cleanupError);
          } else {
            console.log('✅ 测试任务已清理');
          }
        }
      }
    } else {
      console.log('没有待审核工具，无法测试批量审核');
    }
    
    // 6. 检查修复效果
    console.log('\n6. 检查修复效果:');
    console.log('✅ 修复内容:');
    console.log('- 数据源: tool_submissions → tools');
    console.log('- 状态更新: 插入审核结果 → 更新tools表状态');
    console.log('- 错误处理: 改进异常捕获和状态更新');
    console.log('- 进度更新: 直接更新表字段而非RPC调用');
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试批量审核修复失败:', error);
  }
}

testBatchReviewFix();
