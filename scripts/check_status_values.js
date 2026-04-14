// 检查数据库中的实际状态值
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkStatusValues() {
  console.log('🔍 检查数据库中的状态值...');
  
  try {
    // 1. 检查所有不同的状态值
    const { data: statusData, error: statusError } = await supabase
      .from('tools')
      .select('status')
      .not('status', 'is', null);
    
    if (statusError) {
      console.error('❌ 查询状态失败:', statusError);
      return;
    }
    
    const uniqueStatuses = [...new Set(statusData.map(item => item.status))];
    console.log('📊 数据库中的状态值:', uniqueStatuses);
    
    // 2. 统计每个状态的数量
    const statusCounts = {};
    statusData.forEach(item => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    
    console.log('📈 各状态数量统计:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}个`);
    });
    
    // 3. 检查当前查询会返回多少数据
    console.log('\n🔍 测试当前查询...');
    const { data: activeData, error: activeError } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'active');
    
    if (activeError) {
      console.error('❌ 查询active状态失败:', activeError);
    } else {
      console.log(`✅ 查询status='active'返回: ${activeData.length}条记录`);
    }
    
    // 4. 检查是否有其他状态
    console.log('\n🔍 测试其他常见状态...');
    const commonStatuses = ['approved', 'pending', 'deleted'];
    
    for (const status of commonStatuses) {
      const { data: testData, error: testError } = await supabase
        .from('tools')
        .select('*')
        .eq('status', status);
      
      if (!testError && testData) {
        console.log(`✅ 查询status='${status}'返回: ${testData.length}条记录`);
      }
    }
    
    // 5. 总记录数
    const { count, error: countError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (!countError && count !== null) {
      console.log(`\n📊 总记录数: ${count}`);
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

checkStatusValues().catch(console.error);
