// 查找并删除灵动AI工具
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function findAndDeleteLingDongAI() {
  console.log('查找灵动AI工具...');
  
  try {
    // 1. 查找所有包含"灵动AI"的工具
    const { data: tools, error: findError } = await supabase
      .from('tools')
      .select('*')
      .ilike('name', '%灵动AI%');
    
    if (findError) {
      console.error('查找失败:', findError);
      return;
    }
    
    if (!tools || tools.length === 0) {
      console.log('未找到灵动AI工具');
      return;
    }
    
    console.log(`找到 ${tools.length} 个灵动AI工具:`);
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (ID: ${tool.id})`);
      console.log(`   简介: ${tool.tagline}`);
      console.log(`   主分类: ${tool.main_category}`);
      console.log(`   子分类: ${tool.sub_category}`);
      console.log('');
    });
    
    // 2. 删除所有找到的灵动AI工具
    for (const tool of tools) {
      console.log(`正在删除: ${tool.name} (ID: ${tool.id})`);
      
      const { error: deleteError } = await supabase
        .from('tools')
        .delete()
        .eq('id', tool.id);
      
      if (deleteError) {
        console.error(`删除 ${tool.name} 失败:`, deleteError);
      } else {
        console.log(`✅ 成功删除: ${tool.name}`);
      }
    }
    
    // 3. 验证删除结果
    const { data: verifyTools, error: verifyError } = await supabase
      .from('tools')
      .select('*')
      .ilike('name', '%灵动AI%');
    
    if (verifyError) {
      console.error('验证失败:', verifyError);
    } else {
      console.log(`删除后还剩 ${verifyTools?.length || 0} 个灵动AI工具`);
    }
    
    console.log('✅ 删除操作完成');
    
  } catch (error) {
    console.error('操作失败:', error);
  }
}

findAndDeleteLingDongAI().catch(console.error);
