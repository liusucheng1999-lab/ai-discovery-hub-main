// 立即添加is_deleted字段
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function addIsDeletedField() {
  console.log('紧急添加is_deleted字段...');
  
  try {
    // 方法1: 尝试使用RPC执行SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
      `
    });
    
    if (error) {
      console.log('RPC方法失败，尝试其他方法:', error.message);
      
      // 方法2: 使用原始SQL请求
      const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_SERVICE_KEY}`,
          'apikey': process.env.VITE_SUPABASE_SERVICE_KEY
        },
        body: JSON.stringify({
          sql: 'ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;'
        })
      });
      
      if (response.ok) {
        console.log('✅ is_deleted字段添加成功');
      } else {
        console.log('❌ 字段添加失败:', await response.text());
      }
    } else {
      console.log('✅ is_deleted字段添加成功');
    }
    
    // 验证字段是否存在
    console.log('验证字段是否存在...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('验证失败:', tableError);
    } else {
      console.log('✅ 表查询正常，字段可能已添加');
      if (tableInfo && tableInfo.length > 0) {
        const sample = tableInfo[0];
        console.log('样本数据字段:', Object.keys(sample));
        if ('is_deleted' in sample) {
          console.log('✅ is_deleted字段已存在');
        } else {
          console.log('⚠️ is_deleted字段不存在，需要手动添加');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 添加字段失败:', error);
  }
}

addIsDeletedField().catch(console.error);
