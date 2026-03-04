/**
 * 测试自动AI审核计数是否正确
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function testAutoReviewCount() {
  try {
    console.log('=== 测试自动AI审核计数 ===');
    
    // 1. 模拟Admin.tsx中的handleAutoReview逻辑
    console.log('1. 模拟Admin.tsx中的handleAutoReview逻辑:');
    
    // 获取待审核工具数量（Admin.tsx第311-314行）
    const { data: pendingTools, error: pendingError } = await supabase
      .from('tools')
      .select('id, name')
      .eq('status', 'pending');
    
    if (pendingError) {
      console.error('查询待审核工具失败:', pendingError);
      return;
    }
    
    const totalTools = pendingTools?.length || 0;
    console.log(`Admin.tsx查询到的待审核工具数量: ${totalTools} 个`);
    
    // 2. 模拟auto-ai-review-service.ts中的performAutoReview逻辑
    console.log('\n2. 模拟auto-ai-review-service.ts中的performAutoReview逻辑:');
    
    // 获取所有待审核工具（auto-ai-review-service.ts第59-63行）
    const { data: servicePendingTools, error: serviceError } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (serviceError) {
      console.error('服务查询待审核工具失败:', serviceError);
      return;
    }
    
    const serviceTotalTools = servicePendingTools?.length || 0;
    console.log(`auto-ai-review-service.ts查询到的待审核工具数量: ${serviceTotalTools} 个`);
    
    // 3. 比较两个查询结果
    console.log('\n3. 比较查询结果:');
    console.log(`Admin.tsx查询: ${totalTools} 个`);
    console.log(`Service查询: ${serviceTotalTools} 个`);
    
    if (totalTools === serviceTotalTools) {
      console.log('✅ 两个查询结果一致');
    } else {
      console.log(`❌ 查询结果不一致，差异: ${Math.abs(totalTools - serviceTotalTools)} 个`);
    }
    
    // 4. 检查是否有其他状态的工具被误计入
    console.log('\n4. 检查工具状态分布:');
    const { data: allTools, error: allError } = await supabase
      .from('tools')
      .select('status, name');
    
    if (allError) {
      console.error('查询所有工具失败:', allError);
    } else {
      const statusCount = {};
      allTools?.forEach(tool => {
        statusCount[tool.status] = (statusCount[tool.status] || 0) + 1;
      });
      
      console.log('所有工具状态分布:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} 个`);
      });
      
      // 检查是否有类似pending的状态
      const similarStatuses = Object.keys(statusCount).filter(status => 
        status.toLowerCase().includes('pending') || 
        status.toLowerCase().includes('review') ||
        status.toLowerCase().includes('wait')
      );
      
      if (similarStatuses.length > 1) {
        console.log('\n⚠️ 发现类似pending的状态:');
        similarStatuses.forEach(status => {
          console.log(`   - ${status}: ${statusCount[status]} 个`);
        });
      }
    }
    
    // 5. 检查是否有null或undefined状态
    console.log('\n5. 检查null或undefined状态:');
    const { data: nullStatusTools, error: nullError } = await supabase
      .from('tools')
      .select('id, name, status')
      .is('status', null);
    
    if (nullError) {
      console.error('查询null状态工具失败:', nullError);
    } else {
      if (nullStatusTools && nullStatusTools.length > 0) {
        console.log(`发现 ${nullStatusTools.length} 个状态为null的工具:`);
        nullStatusTools.slice(0, 5).forEach(tool => {
          console.log(`   - ${tool.name} (status: ${tool.status})`);
        });
      } else {
        console.log('✅ 没有发现状态为null的工具');
      }
    }
    
    // 6. 检查是否有空字符串状态
    console.log('\n6. 检查空字符串状态:');
    const { data: emptyStatusTools, error: emptyError } = await supabase
      .from('tools')
      .select('id, name, status')
      .eq('status', '');
    
    if (emptyError) {
      console.error('查询空状态工具失败:', emptyError);
    } else {
      if (emptyStatusTools && emptyStatusTools.length > 0) {
        console.log(`发现 ${emptyStatusTools.length} 个状态为空字符串的工具:`);
        emptyStatusTools.slice(0, 5).forEach(tool => {
          console.log(`   - ${tool.name} (status: "${tool.status}")`);
        });
      } else {
        console.log('✅ 没有发现状态为空字符串的工具');
      }
    }
    
    // 7. 分析206这个数字可能的来源
    console.log('\n7. 分析206这个数字可能的来源:');
    
    // 检查所有非active状态的工具
    const { data: nonActiveTools, error: nonActiveError } = await supabase
      .from('tools')
      .select('status')
      .neq('status', 'active');
    
    if (!nonActiveError && nonActiveTools) {
      const nonActiveCount = nonActiveTools.length;
      console.log(`非active状态工具数量: ${nonActiveCount} 个`);
      
      if (nonActiveCount === 206) {
        console.log('✅ 找到了！206可能是所有非active状态的工具数量');
      }
    }
    
    // 检查pending + approved + rejected的总数
    const { data: processedTools, error: processedError } = await supabase
      .from('tools')
      .select('status')
      .in('status', ['pending', 'approved', 'rejected']);
    
    if (!processedError && processedTools) {
      const processedCount = processedTools.length;
      console.log(`pending + approved + rejected状态工具数量: ${processedCount} 个`);
      
      if (processedCount === 206) {
        console.log('✅ 找到了！206可能是所有已处理状态的工具数量');
      }
    }
    
    // 8. 总结
    console.log('\n8. 总结:');
    console.log(`当前实际待审核工具: ${totalTools} 个`);
    console.log(`用户看到的数字: 206 个`);
    console.log(`差异: ${206 - totalTools} 个`);
    
    if (totalTools === 181) {
      console.log('\n✅ 修复后的计数是正确的：181个待审核工具');
      console.log('之前显示206个是因为auto-ai-review-service.ts使用了错误的表');
    } else {
      console.log('\n⚠️ 计数仍有问题，需要进一步调查');
    }
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试自动AI审核计数失败:', error);
  }
}

testAutoReviewCount();
