/**
 * 检查所有相关表
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function checkAllTables() {
  try {
    console.log('=== 检查所有相关表 ===');
    
    // 可能的表名列表
    const possibleTables = [
      'batch_tasks',
      'batch_review_tasks', 
      'ai_review_results',
      'ai_review_logs',
      'review_tasks',
      'task_logs'
    ];
    
    for (const tableName of possibleTables) {
      console.log(`\n检查表: ${tableName}`);
      
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ 表不存在或无权限: ${error.message}`);
        } else {
          console.log(`✅ 表存在`);
          
          // 获取总数
          const { data: countData, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!countError) {
            console.log(`   总记录数: ${count || 0}`);
          }
          
          // 如果有数据，显示最近几条
          if (data && data.length > 0) {
            console.log('   最近记录:');
            data.forEach((record, index) => {
              console.log(`   ${index + 1}. ${JSON.stringify(record, null, 2).substring(0, 200)}...`);
            });
          }
        }
      } catch (err) {
        console.log(`❌ 检查异常: ${err.message}`);
      }
    }
    
    // 检查tools表中是否有运行中的审核相关字段
    console.log('\n检查tools表中的审核状态:');
    const { data: toolsWithStatus, error: toolsError } = await supabase
      .from('tools')
      .select('status', { count: 'exact' });
    
    if (toolsError) {
      console.error('查询tools表失败:', toolsError);
    } else {
      const statusCount = {};
      toolsWithStatus?.forEach(tool => {
        statusCount[tool.status] = (statusCount[tool.status] || 0) + 1;
      });
      
      console.log('tools表状态分布:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`- ${status}: ${count} 个`);
      });
    }
    
    console.log('\n=== 检查完成 ===');
    
  } catch (error) {
    console.error('检查所有表失败:', error);
  }
}

checkAllTables();
