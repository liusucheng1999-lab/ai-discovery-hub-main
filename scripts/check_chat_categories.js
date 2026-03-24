// 查询当前对话类二级分类
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkChatCategories() {
  try {
    // 查询对话类主分类的子分类
    const { data: chatSubCategories, error: subError } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('main_category_id', 'chat')
      .order('sort_order');
    
    if (subError) {
      console.error('查询子分类失败:', subError);
      return;
    }
    
    console.log('当前对话类二级分类:');
    chatSubCategories?.forEach(cat => {
      console.log(`- ${cat.id}: ${cat.name}`);
    });
    
    // 检查是否有您需要的分类
    const requiredCategories = ['chat_domestic', 'chat_overseas', 'chat_general', 'chat_fun'];
    const existingIds = chatSubCategories?.map(cat => cat.id) || [];
    
    console.log('\n需要添加的分类:');
    requiredCategories.forEach(catId => {
      if (!existingIds.includes(catId)) {
        console.log(`- ${catId}: 需要创建`);
      }
    });
    
  } catch (error) {
    console.error('查询失败:', error);
  }
}

checkChatCategories();
