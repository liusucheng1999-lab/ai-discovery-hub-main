// 实时监控删除过程
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function monitorDeleteProcess() {
  console.log('=== 实时监控删除过程 ===');
  
  try {
    // 1. 获取当前所有工具的快照
    console.log('1. 获取删除前的工具列表...');
    const { data: beforeTools, error: beforeError } = await supabase
      .from('tools')
      .select('id, name, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(20);
    
    if (beforeError) {
      console.error('❌ 获取工具列表失败:', beforeError);
      return;
    }
    
    console.log(`✅ 删除前有 ${beforeTools?.length || 0} 个工具`);
    console.log('最新更新的工具:');
    beforeTools?.slice(0, 5).forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (更新时间: ${new Date(tool.updated_at).toLocaleString()})`);
    });
    
    // 2. 模拟前端删除操作
    console.log('\n2. 模拟删除操作...');
    
    // 选择一个最近更新的工具进行测试
    if (beforeTools && beforeTools.length > 0) {
      const testTool = beforeTools[0];
      console.log(`选择测试工具: ${testTool.name} (ID: ${testTool.id})`);
      
      // 记录删除时间
      const deleteStartTime = new Date();
      console.log(`删除开始时间: ${deleteStartTime.toLocaleString()}`);
      
      // 执行删除
      const { error: deleteError, data: deleteData } = await supabase
        .from('tools')
        .delete()
        .eq('id', testTool.id)
        .select();
      
      const deleteEndTime = new Date();
      console.log(`删除结束时间: ${deleteEndTime.toLocaleString()}`);
      console.log(`删除耗时: ${deleteEndTime.getTime() - deleteStartTime.getTime()}ms`);
      
      if (deleteError) {
        console.error('❌ 删除操作失败:', deleteError);
        return;
      }
      
      console.log('✅ 删除操作成功');
      console.log('删除的数据:', deleteData);
      
      // 3. 立即验证删除结果
      console.log('\n3. 验证删除结果...');
      
      // 等待一小段时间确保数据库操作完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: afterTools, error: afterError } = await supabase
        .from('tools')
        .select('id, name')
        .eq('id', testTool.id);
      
      if (afterError) {
        console.error('❌ 验证查询失败:', afterError);
      } else {
        if (afterTools && afterTools.length > 0) {
          console.log('❌ 删除失败 - 工具仍然存在:');
          afterTools.forEach(tool => {
            console.log(`- ${tool.name} (ID: ${tool.id})`);
          });
          
          // 检查是否有其他问题
          console.log('\n🔍 深入分析...');
          
          // 检查工具状态
          const { data: statusCheck, error: statusError } = await supabase
            .from('tools')
            .select('id, name, status, updated_at')
            .eq('id', testTool.id)
            .single();
          
          if (!statusError && statusCheck) {
            console.log('工具状态信息:');
            console.log(`- 状态: ${statusCheck.status}`);
            console.log(`- 更新时间: ${new Date(statusCheck.updated_at).toLocaleString()}`);
            
            // 如果状态不是active/approved，可能是前端过滤问题
            if (statusCheck.status !== 'active' && statusCheck.status !== 'approved') {
              console.log('💡 可能原因: 工具状态不是active/approved，前端可能仍然显示');
            }
          }
          
        } else {
          console.log('✅ 删除成功 - 工具已不存在');
        }
      }
      
      // 4. 检查前端可能获取的数据
      console.log('\n4. 检查前端数据查询...');
      
      const { data: frontendData, error: frontendError } = await supabase
        .from('tools')
        .select('*')
        .in('status', ['approved', 'active'])
        .order('view_count', { ascending: false })
        .limit(10);
      
      if (frontendError) {
        console.error('❌ 前端数据查询失败:', frontendError);
      } else {
        console.log(`前端将获取到 ${frontendData?.length || 0} 个工具`);
        
        // 检查被删除的工具是否还在前端数据中
        const deletedToolInFrontend = frontendData?.find(tool => tool.id === testTool.id);
        if (deletedToolInFrontend) {
          console.log('❌ 被删除的工具仍在前端数据中!');
          console.log('工具信息:', {
            name: deletedToolInFrontend.name,
            status: deletedToolInFrontend.status,
            updated_at: deletedToolInFrontend.updated_at
          });
        } else {
          console.log('✅ 被删除的工具不在前端数据中');
        }
      }
    }
    
    console.log('\n=== 监控完成 ===');
    
  } catch (error) {
    console.error('❌ 监控过程出错:', error);
  }
}

monitorDeleteProcess().catch(console.error);
