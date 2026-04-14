// 检查实际的查询结果
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkQuery() {
  console.log('🔍 检查前端查询逻辑...');
  
  try {
    // 1. 测试当前的查询条件
    console.log('\n📊 测试: in([\'active\', \'approved\'])');
    const { data: result1, error: error1 } = await supabase
      .from('tools')
      .select('*')
      .in('status', ['active', 'approved'])
      .order('view_count', { ascending: false })
      .limit(2000);
    
    if (error1) {
      console.error('❌ 查询1失败:', error1);
    } else {
      console.log(`✅ 查询1返回: ${result1.length}条记录`);
    }
    
    // 2. 测试只排除deleted和rejected
    console.log('\n📊 测试: not.in([\'deleted\', \'rejected\', \'pending\'])');
    const { data: result2, error: error2 } = await supabase
      .from('tools')
      .select('*')
      .not('status', 'in', ['deleted', 'rejected', 'pending'])
      .order('view_count', { ascending: false })
      .limit(2000);
    
    if (error2) {
      console.error('❌ 查询2失败:', error2);
    } else {
      console.log(`✅ 查询2返回: ${result2.length}条记录`);
    }
    
    // 3. 检查前1000条记录的状态分布
    console.log('\n📊 检查前1000条记录的状态:');
    const { data: result3, error: error3 } = await supabase
      .from('tools')
      .select('status, name')
      .order('view_count', { ascending: false })
      .limit(1000);
    
    if (error3) {
      console.error('❌ 查询3失败:', error3);
    } else {
      const statusCounts = {};
      result3.forEach(item => {
        statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
      });
      console.log('前1000条记录状态分布:', statusCounts);
    }
    
    // 4. 检查是否有null状态
    console.log('\n📊 检查null状态:');
    const { data: result4, error: error4 } = await supabase
      .from('tools')
      .select('*')
      .is('status', null)
      .limit(10);
    
    if (error4) {
      console.error('❌ 查询4失败:', error4);
    } else {
      console.log(`✅ null状态记录: ${result4.length}条`);
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

checkQuery().catch(console.error);
