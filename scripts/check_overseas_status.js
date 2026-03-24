// 检查海外模型应用状态
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkOverseasModelsStatus() {
  try {
    const overseasApps = ['ChatGPT', 'Claude', 'Gemini', 'Google Bard', 'Mistral AI', 'Cohere AI', 'Meta AI', 'AI21 Labs', 'Stability AI'];
    
    for (const appName of overseasApps) {
      const { data: app, error } = await supabase
        .from('tools')
        .select('*')
        .eq('name', appName)
        .single();
      
      if (error) {
        console.log(`${appName}: 未找到`);
      } else {
        console.log(`${appName}:`);
        console.log(`  - 状态: ${app.status}`);
        console.log(`  - 主分类: ${app.main_category}`);
        console.log(`  - 子分类: ${app.sub_category}`);
        console.log('');
      }
    }
    
  } catch (error) {
    console.error('检查失败:', error);
  }
}

checkOverseasModelsStatus();
