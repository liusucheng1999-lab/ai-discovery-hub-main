// 验证海外模型分类
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function verifyOverseasModels() {
  try {
    const { data: apps, error } = await supabase
      .from('tools')
      .select('*')
      .eq('main_category', 'chat')
      .eq('sub_category', 'chat_overseas')
      .eq('status', 'approved');
    
    if (error) {
      console.error('查询失败:', error);
      return;
    }
    
    console.log('海外模型分类下的应用:');
    apps.forEach(app => {
      console.log(`- ${app.name}`);
    });
    console.log(`\n总计: ${apps.length} 个应用`);
    
  } catch (error) {
    console.error('验证失败:', error);
  }
}

verifyOverseasModels();
