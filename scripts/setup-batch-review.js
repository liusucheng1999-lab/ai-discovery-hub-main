/**
 * 设置批量审核后台任务系统
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://enzduxajblrfbbdktieo.supabase.co', 
  'sb_secret_8K1ocDrBwFZC5DojHBii3g_wvd3fS2k'
);

async function setupBatchReviewSystem() {
  try {
    console.log('=== 设置批量审核后台任务系统 ===');
    
    // 读取SQL文件内容
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, 'create-batch-review-tasks.sql');
    
    if (!fs.existsSync(sqlFile)) {
      console.error('SQL文件不存在:', sqlFile);
      return;
    }
    
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // 分割SQL语句
    const sqlStatements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`找到 ${sqlStatements.length} 个SQL语句`);
    
    // 逐个执行SQL语句
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      console.log(`执行SQL ${i + 1}/${sqlStatements.length}: ${sql.substring(0, 50)}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
          // 如果RPC不存在，尝试直接SQL（需要管理员权限）
          console.log('RPC执行失败，可能需要手动执行SQL');
          console.log('请在Supabase SQL编辑器中运行以下SQL:');
          console.log(sql);
          console.log('');
        } else {
          console.log('✅ SQL执行成功');
        }
      } catch (err) {
        console.log('❌ SQL执行失败:', err.message);
        console.log('请手动执行:', sql);
        console.log('');
      }
    }
    
    // 验证表是否创建成功
    console.log('\n=== 验证表结构 ===');
    
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('batch_review_tasks')
        .select('*')
        .limit(1);
      
      if (taskError) {
        console.log('❌ batch_review_tasks表不存在或无法访问');
      } else {
        console.log('✅ batch_review_tasks表已存在');
        if (taskData && taskData.length > 0) {
          console.log('字段:', Object.keys(taskData[0]));
        }
      }
    } catch (err) {
      console.log('❌ 检查batch_review_tasks表失败:', err.message);
    }
    
    try {
      const { data: resultData, error: resultError } = await supabase
        .from('ai_review_results')
        .select('*')
        .limit(1);
      
      if (resultError) {
        console.log('❌ ai_review_results表不存在或无法访问');
      } else {
        console.log('✅ ai_review_results表已存在');
        if (resultData && resultData.length > 0) {
          console.log('字段:', Object.keys(resultData[0]));
        }
      }
    } catch (err) {
      console.log('❌ 检查ai_review_results表失败:', err.message);
    }
    
    console.log('\n=== 设置完成 ===');
    console.log('如果表创建失败，请手动在Supabase SQL编辑器中运行:');
    console.log('1. scripts/create-batch-review-tasks.sql 中的所有SQL语句');
    console.log('2. 确保所有表和函数都创建成功');
    console.log('3. 验证表结构正确');
    
  } catch (error) {
    console.error('设置失败:', error);
  }
}

setupBatchReviewSystem();
