/**
 * 检查已审核数据为什么没有在首页显示
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkApprovedTools() {
  try {
    console.log('=== 检查已审核数据在首页显示情况 ===');
    
    // 1. 检查tools表中的状态分布
    console.log('1. 检查tools表状态分布:');
    const { data: statusData, error: statusError } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (statusError) {
      console.error('查询状态分布失败:', statusError);
      return;
    }
    
    const statusCount = {};
    statusData?.forEach(tool => {
      statusCount[tool.status] = (statusCount[tool.status] || 0) + 1;
    });
    
    console.log('状态分布:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`- ${status}: ${count} 个`);
    });
    
    // 2. 检查首页应该显示的工具数量
    console.log('\n2. 检查首页应该显示的工具:');
    const { data: homepageTools, error: homepageError } = await supabase
      .from('tools')
      .select('id, name, status, category, ai_review_result')
      .in('status', ['approved', 'active'])
      .order('view_count', { ascending: false });
    
    if (homepageError) {
      console.error('查询首页工具失败:', homepageError);
      return;
    }
    
    console.log(`首页应该显示 ${homepageTools?.length || 0} 个工具`);
    if (homepageTools && homepageTools.length > 0) {
      console.log('前10个工具:');
      homepageTools.slice(0, 10).forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - ${tool.status} - ${tool.category}`);
      });
    }
    
    // 3. 检查有AI审核结果但状态不正确的工具
    console.log('\n3. 检查有AI审核结果但状态异常的工具:');
    const { data: aiReviewedTools, error: aiError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result')
      .not('ai_review_result', 'is', null);
    
    if (aiError) {
      console.error('查询AI审核工具失败:', aiError);
      return;
    }
    
    console.log(`有AI审核结果的工具: ${aiReviewedTools?.length || 0} 个`);
    
    if (aiReviewedTools && aiReviewedTools.length > 0) {
      const statusIssues = [];
      
      aiReviewedTools.forEach(tool => {
        try {
          const aiResult = typeof tool.ai_review_result === 'string' 
            ? JSON.parse(tool.ai_review_result) 
            : tool.ai_review_result;
          
          const recommendation = aiResult?.recommendation;
          
          // 检查状态是否与AI建议匹配
          if (recommendation === 'approve' && tool.status !== 'approved' && tool.status !== 'active') {
            statusIssues.push({
              id: tool.id,
              name: tool.name,
              currentStatus: tool.status,
              aiRecommendation: recommendation,
              issue: 'AI建议通过但状态不是approved/active'
            });
          } else if (recommendation === 'reject' && tool.status !== 'rejected') {
            statusIssues.push({
              id: tool.id,
              name: tool.name,
              currentStatus: tool.status,
              aiRecommendation: recommendation,
              issue: 'AI建议拒绝但状态不是rejected'
            });
          }
        } catch (e) {
          console.log(`工具 ${tool.name} 的AI审核结果解析失败`);
        }
      });
      
      if (statusIssues.length > 0) {
        console.log(`发现 ${statusIssues.length} 个状态不匹配的工具:`);
        statusIssues.forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.name}`);
          console.log(`   当前状态: ${issue.currentStatus}`);
          console.log(`   AI建议: ${issue.aiRecommendation}`);
          console.log(`   问题: ${issue.issue}`);
        });
      } else {
        console.log('✅ 所有工具状态都与AI建议匹配');
      }
    }
    
    // 4. 检查pending状态但应该显示的工具
    console.log('\n4. 检查pending状态但可能有AI审核结果的工具:');
    const { data: pendingWithAi, error: pendingError } = await supabase
      .from('tools')
      .select('id, name, status, ai_review_result, created_at')
      .eq('status', 'pending')
      .not('ai_review_result', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (pendingError) {
      console.error('查询pending工具失败:', pendingError);
      return;
    }
    
    console.log(`pending状态但有AI审核结果的工具: ${pendingWithAi?.length || 0} 个`);
    if (pendingWithAi && pendingWithAi.length > 0) {
      pendingWithAi.forEach((tool, index) => {
        try {
          const aiResult = typeof tool.ai_review_result === 'string' 
            ? JSON.parse(tool.ai_review_result) 
            : tool.ai_review_result;
          
          console.log(`${index + 1}. ${tool.name}`);
          console.log(`   状态: ${tool.status}`);
          console.log(`   AI建议: ${aiResult?.recommendation || '未知'}`);
          console.log(`   创建时间: ${tool.created_at}`);
          
          if (aiResult?.recommendation === 'approve') {
            console.log(`   ⚠️ 应该显示在首页但状态是pending`);
          }
        } catch (e) {
          console.log(`${index + 1}. ${tool.name} - AI结果解析失败`);
        }
      });
    }
    
    // 5. 提供修复建议
    console.log('\n5. 修复建议:');
    
    const statusIssues = []; // 重新定义变量
    
    // 重新检查状态不匹配的工具
    if (aiReviewedTools && aiReviewedTools.length > 0) {
      aiReviewedTools.forEach(tool => {
        try {
          const aiResult = typeof tool.ai_review_result === 'string' 
            ? JSON.parse(tool.ai_review_result) 
            : tool.ai_review_result;
          
          const recommendation = aiResult?.recommendation;
          
          // 检查状态是否与AI建议匹配
          if (recommendation === 'approve' && tool.status !== 'approved' && tool.status !== 'active') {
            statusIssues.push({
              id: tool.id,
              name: tool.name,
              currentStatus: tool.status,
              aiRecommendation: recommendation,
              issue: 'AI建议通过但状态不是approved/active'
            });
          } else if (recommendation === 'reject' && tool.status !== 'rejected') {
            statusIssues.push({
              id: tool.id,
              name: tool.name,
              currentStatus: tool.status,
              aiRecommendation: recommendation,
              issue: 'AI建议拒绝但状态不是rejected'
            });
          }
        } catch (e) {
          console.log(`工具 ${tool.name} 的AI审核结果解析失败`);
        }
      });
    }
    
    if (statusIssues.length > 0) {
      console.log('发现状态不匹配的工具，建议执行以下SQL修复:');
      console.log('\n```sql');
      console.log('-- 将AI建议通过但状态为pending的工具改为approved');
      console.log('UPDATE tools SET status = \'approved\'');
      console.log('WHERE ai_review_result->>\'recommendation\' = \'approve\'');
      console.log('AND status = \'pending\';');
      console.log('\n-- 将AI建议通过但状态为pending的工具改为active（直接显示在首页）');
      console.log('UPDATE tools SET status = \'active\'');
      console.log('WHERE ai_review_result->>\'recommendation\' = \'approve\'');
      console.log('AND status = \'pending\';');
      console.log('```');
    } else {
      console.log('✅ 所有工具状态都与AI建议匹配');
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查已审核数据失败:', error);
  }
}

checkApprovedTools();
