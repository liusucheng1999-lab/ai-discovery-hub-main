// 修正海外模型分类
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function fixOverseasModels() {
  try {
    const overseasModels = ['ChatGPT', 'Claude', 'Gemini'];
    
    for (const appName of overseasModels) {
      const { error } = await supabase
        .from('tools')
        .update({
          sub_category: 'chat_overseas',
          updated_at: new Date().toISOString()
        })
        .eq('name', appName);
      
      if (error) {
        console.error(`更新 ${appName} 失败:`, error);
      } else {
        console.log(`✓ 成功将 ${appName} 更新为海外模型`);
      }
    }
    
    // 验证结果
    const { data: apps, error } = await supabase
      .from('tools')
      .select('name')
      .eq('main_category', 'chat')
      .eq('sub_category', 'chat_overseas')
      .eq('status', 'active');
    
    if (error) {
      console.error('验证失败:', error);
    } else {
      console.log('\n海外模型分类下的应用:');
      apps.forEach(app => console.log(`- ${app.name}`));
      console.log(`\n总计: ${apps.length} 个应用`);
    }
    
  } catch (error) {
    console.error('修正失败:', error);
  }
}

fixOverseasModels();
