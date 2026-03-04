/**
 * 修复已审核数据状态不匹配的问题
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function fixApprovedStatus() {
  try {
    console.log('=== 修复已审核数据状态不匹配问题 ===');
    
    // 1. 查找AI建议通过但状态不是approved/active的工具
    console.log('1. 查找AI建议通过但状态不正确的工具:');
    const { data: approveIssues, error: approveError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result')
      .eq('ai_review_result->>recommendation', 'approve')
      .in('status', ['pending', 'rejected']);
    
    if (approveError) {
      console.error('查询AI建议通过的工具失败:', approveError);
      return;
    }
    
    console.log(`找到 ${approveIssues?.length || 0} 个AI建议通过但状态不正确的工具:`);
    
    if (approveIssues && approveIssues.length > 0) {
      approveIssues.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - 当前状态: ${tool.status}`);
      });
      
      // 修复这些工具的状态为approved
      console.log('\n修复这些工具的状态为approved...');
      const { error: fixApproveError } = await supabase
        .from('tools')
        .update({ status: 'approved' })
        .eq('ai_review_result->>recommendation', 'approve')
        .in('status', ['pending', 'rejected']);
      
      if (fixApproveError) {
        console.error('修复approved状态失败:', fixApproveError);
      } else {
        console.log('✅ 成功修复approved状态');
      }
    }
    
    // 2. 查找AI建议拒绝但状态不是rejected的工具
    console.log('\n2. 查找AI建议拒绝但状态不正确的工具:');
    const { data: rejectIssues, error: rejectError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result')
      .eq('ai_review_result->>recommendation', 'reject')
      .not('status', 'eq', 'rejected');
    
    if (rejectError) {
      console.error('查询AI建议拒绝的工具失败:', rejectError);
      return;
    }
    
    console.log(`找到 ${rejectIssues?.length || 0} 个AI建议拒绝但状态不正确的工具:`);
    
    if (rejectIssues && rejectIssues.length > 0) {
      rejectIssues.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - 当前状态: ${tool.status}`);
      });
      
      // 修复这些工具的状态为rejected
      console.log('\n修复这些工具的状态为rejected...');
      const { error: fixRejectError } = await supabase
        .from('tools')
        .update({ status: 'rejected' })
        .eq('ai_review_result->>recommendation', 'reject')
        .not('status', 'eq', 'rejected');
      
      if (fixRejectError) {
        console.error('修复rejected状态失败:', fixRejectError);
      } else {
        console.log('✅ 成功修复rejected状态');
      }
    }
    
    // 3. 查找AI建议人工审核但状态不正确的工具
    console.log('\n3. 查找AI建议人工审核的工具:');
    const { data: manualIssues, error: manualError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result')
      .eq('ai_review_result->>recommendation', 'manual_review')
      .not('status', 'eq', 'pending');
    
    if (manualError) {
      console.error('查询AI建议人工审核的工具失败:', manualError);
      return;
    }
    
    console.log(`找到 ${manualIssues?.length || 0} 个AI建议人工审核但状态不正确的工具:`);
    
    if (manualIssues && manualIssues.length > 0) {
      manualIssues.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - 当前状态: ${tool.status}`);
      });
      
      // 修复这些工具的状态为pending
      console.log('\n修复这些工具的状态为pending...');
      const { error: fixManualError } = await supabase
        .from('tools')
        .update({ status: 'pending' })
        .eq('ai_review_result->>recommendation', 'manual_review')
        .not('status', 'eq', 'pending');
      
      if (fixManualError) {
        console.error('修复pending状态失败:', fixManualError);
      } else {
        console.log('✅ 成功修复pending状态');
      }
    }
    
    // 4. 验证修复结果
    console.log('\n4. 验证修复结果:');
    
    // 重新检查状态分布
    const { data: finalStatus, error: finalError } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (finalError) {
      console.error('查询最终状态失败:', finalError);
    } else {
      const finalStatusCount = {};
      finalStatus?.forEach(tool => {
        finalStatusCount[tool.status] = (finalStatusCount[tool.status] || 0) + 1;
      });
      
      console.log('修复后状态分布:');
      Object.entries(finalStatusCount).forEach(([status, count]) => {
        console.log(`- ${status}: ${count} 个`);
      });
      
      // 计算首页将显示的工具数量
      const homepageVisible = (finalStatusCount['approved'] || 0) + (finalStatusCount['active'] || 0);
      console.log(`\n📱 修复后首页将显示: ${homepageVisible} 个工具`);
      
      const beforeCount = 90; // 修复前的数量
      const afterCount = homepageVisible;
      const diff = afterCount - beforeCount;
      
      if (diff > 0) {
        console.log(`✅ 首页显示增加了 ${diff} 个工具！`);
      } else if (diff === 0) {
        console.log('✅ 首页显示数量无变化（可能已经正确）');
      } else {
        console.log(`⚠️ 首页显示减少了 ${Math.abs(diff)} 个工具`);
      }
    }
    
    // 5. 检查还有没有状态不匹配的工具
    console.log('\n5. 检查是否还有状态不匹配的工具:');
    const { data: remainingIssues, error: remainingError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result')
      .not('ai_review_result', 'is', null);
    
    if (remainingError) {
      console.error('查询剩余问题工具失败:', remainingError);
    } else {
      let issuesCount = 0;
      
      if (remainingIssues && remainingIssues.length > 0) {
        remainingIssues.forEach(tool => {
          try {
            const aiResult = typeof tool.ai_review_result === 'string' 
              ? JSON.parse(tool.ai_review_result) 
              : tool.ai_review_result;
            
            const recommendation = aiResult?.recommendation;
            
            if (recommendation === 'approve' && tool.status !== 'approved' && tool.status !== 'active') {
              issuesCount++;
            } else if (recommendation === 'reject' && tool.status !== 'rejected') {
              issuesCount++;
            } else if (recommendation === 'manual_review' && tool.status !== 'pending') {
              issuesCount++;
            }
          } catch (e) {
            // 忽略解析错误
          }
        });
      }
      
      if (issuesCount === 0) {
        console.log('✅ 所有工具状态都与AI建议匹配！');
      } else {
        console.log(`⚠️ 还有 ${issuesCount} 个工具状态不匹配`);
      }
    }
    
    console.log('\n=== 修复完成 ===');
    
  } catch (error) {
    console.error('修复已审核数据状态失败:', error);
  }
}

fixApprovedStatus();
