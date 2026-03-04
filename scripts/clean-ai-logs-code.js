/**
 * 清理Admin.tsx中的AI审核日志相关代码
 */

import fs from 'fs';

function cleanAiLogsCode() {
  try {
    console.log('=== 清理AI审核日志相关代码 ===');
    
    const adminFilePath = '/Users/stellaliu/Documents/ai-discovery-hub-main/src/pages/Admin.tsx';
    
    // 读取文件
    let content = fs.readFileSync(adminFilePath, 'utf8');
    
    console.log('1. 删除AI审核日志相关的状态变量...');
    
    // 删除状态变量
    content = content.replace(/const \[reviewLogs, setReviewLogs\] = useState<ReviewLog\[\]>\(\[\]);\s*\n/g, '');
    content = content.replace(/const \[showReviewLog, setShowReviewLog\] = useState<ReviewLog \| null>\(null\);\s*\n/g, '');
    
    console.log('2. 删除AI审核日志相关的useEffect...');
    
    // 删除加载审核日志的useEffect
    const loadReviewLogsStart = '// 加载审核日志';
    const loadReviewLogsEnd = '}, \[\]);';
    
    const startIndex = content.indexOf(loadReviewLogsStart);
    const endIndex = content.indexOf(loadReviewLogsEnd, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const before = content.substring(0, startIndex);
      const after = content.substring(endIndex + loadReviewLogsEnd.length);
      content = before + after;
      console.log('✅ 删除了加载审核日志的useEffect');
    }
    
    console.log('3. 删除AI审核日志相关的函数调用...');
    
    // 删除autoAiReviewService导入
    content = content.replace(/import \{ autoAiReviewService \} from.*\n/g, '');
    
    // 删除ReviewLog接口
    content = content.replace(/export interface ReviewLog \{[^}]*\}\s*\n/g, '');
    
    // 删除handleAutoReview中的setReviewLogs调用
    content = content.replace(/const logs = await autoAiReviewService\.getReviewLogs\(\);\s*setReviewLogs\(logs\);\s*\n/g, '');
    
    // 删除handleConfirmReview中的setReviewLogs调用
    content = content.replace(/const logs = await autoAiReviewService\.getReviewLogs\(\);\s*setReviewLogs\(logs\);\s*\n/g, '');
    
    // 删除handleCancelReview中的setReviewLogs调用
    content = content.replace(/const logs = await autoAiReviewService\.getReviewLogs\(\);\s*setReviewLogs\(logs\);\s*\n/g, '');
    
    console.log('4. 删除AI审核日志相关的UI组件...');
    
    // 删除AI审核日志标签按钮
    const logsButtonStart = 'onClick={() => setActiveTab(\'logs\')}';
    const logsButtonEnd = 'className={`px-4 py-2 font-medium transition-colors';
    
    const buttonStartIndex = content.indexOf(logsButtonStart);
    const buttonEndIndex = content.indexOf(logsButtonEnd, buttonStartIndex);
    
    if (buttonStartIndex !== -1 && buttonEndIndex !== -1) {
      const beforeButton = content.substring(0, buttonStartIndex - 50); // 往前找一些
      const afterButton = content.substring(buttonEndIndex + logsButtonEnd.length + 100); // 往后找一些
      content = beforeButton + afterButton;
      console.log('✅ 删除了AI审核日志按钮');
    }
    
    // 删除AI审核日志页面
    const logsPageStart = '{/* AI审核日志页面 */}';
    const logsPageEnd = '{/* 审核日志详情弹窗 */}';
    
    const pageStartIndex = content.indexOf(logsPageStart);
    const pageEndIndex = content.indexOf(logsPageEnd);
    
    if (pageStartIndex !== -1 && pageEndIndex !== -1) {
      const beforePage = content.substring(0, pageStartIndex);
      const afterPage = content.substring(pageEndIndex + logsPageEnd.length);
      content = beforePage + afterPage;
      console.log('✅ 删除了AI审核日志页面');
    }
    
    console.log('5. 清理多余的空行...');
    
    // 清理多余的空行
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/^\s*\n/, '');
    content = content.replace(/\n\s*$/, '');
    
    console.log('6. 写入清理后的文件...');
    
    // 写入文件
    fs.writeFileSync(adminFilePath, content);
    
    console.log('✅ AI审核日志相关代码清理完成！');
    console.log('\n清理内容:');
    console.log('- 删除了reviewLogs和showReviewLog状态变量');
    console.log('- 删除了加载审核日志的useEffect');
    console.log('- 删除了autoAiReviewService导入');
    console.log('- 删除了ReviewLog接口');
    console.log('- 删除了AI审核日志按钮');
    console.log('- 删除了AI审核日志页面');
    console.log('- 删除了相关函数调用');
    
    console.log('\n保留的功能:');
    console.log('- 批量审核任务管理');
    console.log('- AI审核结果管理');
    console.log('- 工具审核状态管理');
    
  } catch (error) {
    console.error('清理AI审核日志代码失败:', error);
  }
}

cleanAiLogsCode();
