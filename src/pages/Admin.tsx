// src/pages/Admin.tsx
// 管理员审核后台

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { deepSeekService, type AIReviewResult } from "@/lib/deepseek-service";
import { autoAiReviewService, type ReviewLog } from "@/lib/auto-ai-review-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Check, X, Eye, ExternalLink, Bot, AlertCircle, Star, Copy, Calendar, Clock, Play, Trash2, Filter } from "lucide-react";
import { getToolLogo, getFallbackLogo } from "@/lib/logo-utils";

interface ToolSubmission {
  id: string;
  name: string;
  website_url: string;
  tagline: string;
  category: string;
  pricing_type: string;
  is_china_available: boolean;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AIReviewCache {
  [toolId: string]: AIReviewResult;
}

export default function Admin() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'logs'>('pending');
  const [aiReviews, setAiReviews] = useState<AIReviewCache>({});
  const [aiProcessing, setAiProcessing] = useState<string[]>([]);
  const [showAiReview, setShowAiReview] = useState<string | null>(null);
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([]);
  const [showReviewLog, setShowReviewLog] = useState<ReviewLog | null>(null);
  const [autoReviewProcessing, setAutoReviewProcessing] = useState(false);
  const [autoReviewProgress, setAutoReviewProgress] = useState({
    current: 0,
    total: 0,
    currentTool: '',
    status: 'idle' as 'idle' | 'processing' | 'completed' | 'error'
  });
  const [aiReviewFilter, setAiReviewFilter] = useState<'all' | 'approve' | 'manual_review' | 'reject'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>(''); // 新增来源筛选状态
  const [batchReviewProgress, setBatchReviewProgress] = useState({
    current: 0,
    total: 0,
    currentTool: '',
    isProcessing: false
  });
  
  // 流式输出状态
  const [streamingToolId, setStreamingToolId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');

  // 加载待审核工具
  useEffect(() => {
    async function loadSubmissions() {
      try {
        console.log('开始加载工具提交数据...');
        
        // 先测试数据库连接
        console.log('测试数据库连接...');
        const { data: testData, error: testError } = await supabase
          .from('tool_submissions')
          .select('count')
          .limit(1);
        
        console.log('数据库连接测试结果:', { testData, testError });
        
        if (testError) {
          console.error('数据库连接失败:', testError);
          alert('数据库连接失败，请检查配置');
          return;
        }
        
        // 加载实际数据，包含AI审核结果
        let query = supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        // 根据筛选条件添加AI审核结果过滤
        if (aiReviewFilter !== 'all') {
          console.log('应用AI审核筛选:', aiReviewFilter);
          if (aiReviewFilter === 'approve') {
            query = query.not('ai_review_result', 'is', null)
                         .eq('ai_review_result->>recommendation', 'approve');
          } else if (aiReviewFilter === 'manual_review') {
            query = query.not('ai_review_result', 'is', null)
                         .eq('ai_review_result->>recommendation', 'manual_review');
          } else if (aiReviewFilter === 'reject') {
            query = query.not('ai_review_result', 'is', null)
                         .eq('ai_review_result->>recommendation', 'reject');
          }
          console.log('筛选后的查询:', query);
        }

        // 添加来源筛选
        if (sourceFilter.trim()) {
          console.log('应用来源筛选:', sourceFilter);
          query = query.ilike('note', `%${sourceFilter.trim()}%`);
          console.log('来源筛选后的查询:', query);
        }

        const { data, error } = await query;

        console.log('工具提交数据加载结果:', { data, error });
        
        // 调试：查找Microsoft Copilot
        if (data && data.length > 0) {
          console.log('所有工具列表:');
          data.forEach((tool, index) => {
            console.log(`${index + 1}. ${tool.name} - ${tool.status}`);
          });
          
          const microsoftCopilot = data.find(tool => 
            tool.name.toLowerCase().includes('microsoft') && 
            tool.name.toLowerCase().includes('copilot')
          );
          
          if (microsoftCopilot) {
            console.log('找到Microsoft Copilot:', microsoftCopilot);
          } else {
            console.log('未找到Microsoft Copilot');
          }
        }
        
        // 调试：检查AI审核结果的数据结构
        if (data && data.length > 0) {
          console.log('检查AI审核结果数据结构:');
          data.forEach((tool, index) => {
            console.log(`工具 ${index + 1}: ${tool.name}`);
            console.log(`  ai_review_result:`, tool.ai_review_result);
            if (tool.ai_review_result) {
              console.log(`  recommendation:`, tool.ai_review_result.recommendation);
            }
          });
        }
        
        if (error) {
          console.error('加载待审核工具失败:', error);
          alert('加载数据失败，请检查控制台');
        } else {
          console.log('设置submissions数据:', data?.length || 0, '条记录');
          setSubmissions(data || []);
          
          // 加载已保存的AI审核结果
          const savedReviews: AIReviewCache = {};
          data?.forEach(tool => {
            if (tool.ai_review_result) {
              savedReviews[tool.id] = tool.ai_review_result;
            }
          });
          setAiReviews(savedReviews);
          console.log('加载了', Object.keys(savedReviews).length, '个已保存的AI审核结果');
          
          if (data?.length === 0) {
            console.log('数据库中没有工具提交数据');
          }
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        alert('加载数据失败，请检查控制台');
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [activeTab, aiReviewFilter, sourceFilter]);

  // 加载审核日志
  useEffect(() => {
    let logsTableExists = true;
    
    async function loadReviewLogs() {
      try {
        const logs = await autoAiReviewService.getReviewLogs();
        setReviewLogs(logs);
        logsTableExists = true;
      } catch (err: any) {
        if (err?.message?.includes('ai_review_logs') || err?.code === 'PGRST205') {
          if (logsTableExists) {
            console.log('AI审核日志表不存在，跳过加载');
            logsTableExists = false;
          }
          setReviewLogs([]);
        } else {
          console.error('加载审核日志失败:', err);
        }
      }
    }

    loadReviewLogs();
    
    // 只有在表存在时才设置定时刷新
    let interval: NodeJS.Timeout | null = null;
    if (logsTableExists) {
      interval = setInterval(() => {
        loadReviewLogs();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // 手动触发自动AI审核
  const handleAutoReview = async () => {
    setAutoReviewProcessing(true);
    setAutoReviewProgress({
      current: 0,
      total: 0,
      currentTool: '准备开始...',
      status: 'processing'
    });
    
    try {
      // 获取待审核工具数量
      const { data: pendingTools } = await supabase
        .from('tool_submissions')
        .select('id, name')
        .eq('status', 'pending');
      
      const totalTools = pendingTools?.length || 0;
      
      if (totalTools === 0) {
        setAutoReviewProgress({
          current: 0,
          total: 0,
          currentTool: '没有待审核的工具',
          status: 'completed'
        });
        alert('没有待审核的工具');
        return;
      }

      setAutoReviewProgress(prev => ({
        ...prev,
        total: totalTools,
        currentTool: '开始AI审核...'
      }));

      const reviewLog = await autoAiReviewService.performAutoReview(
      (current, total, currentTool) => {
        setAutoReviewProgress({
          current,
          total,
          currentTool,
          status: 'processing'
        });
      }
    );
      
      if (reviewLog) {
        setAutoReviewProgress({
          current: totalTools,
          total: totalTools,
          currentTool: '审核完成！',
          status: 'completed'
        });
        
        // 显示成功消息
        setTimeout(() => {
          alert(`自动AI审核完成！共审核了 ${totalTools} 个工具，请查看审核日志。`);
        }, 500);
        
        // 重新加载审核日志和工具数据
        const logs = await autoAiReviewService.getReviewLogs();
        setReviewLogs(logs);
        
        const { data: refreshedData } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        setSubmissions(refreshedData || []);
        
        // 切换到日志页面
        setActiveTab('logs');
        
        // 重置进度状态
        setTimeout(() => {
          setAutoReviewProgress({
            current: 0,
            total: 0,
            currentTool: '',
            status: 'idle'
          });
        }, 3000);
        
      } else {
        setAutoReviewProgress({
          current: 0,
          total: 0,
          currentTool: '审核失败',
          status: 'error'
        });
        alert('审核失败，请检查控制台日志');
      }
    } catch (error) {
      console.error('自动AI审核失败:', error);
      setAutoReviewProgress({
        current: 0,
        total: 0,
        currentTool: '审核出错',
        status: 'error'
      });
      alert('自动AI审核失败，请重试');
    } finally {
      setAutoReviewProcessing(false);
    }
  };

  // 确认并执行审核结果
  const handleConfirmReview = async (logId: string) => {
    if (!confirm('确定要执行这个审核结果吗？这将自动通过或拒绝相应的工具。')) return;
    
    try {
      const success = await autoAiReviewService.confirmAndExecuteReview(logId);
      if (success) {
        alert('审核结果执行成功！');
        // 重新加载日志和工具数据
        const logs = await autoAiReviewService.getReviewLogs();
        setReviewLogs(logs);
        
        const { data: refreshedData } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        setSubmissions(refreshedData || []);
      } else {
        alert('审核结果执行失败');
      }
    } catch (error) {
      console.error('确认审核失败:', error);
      alert('确认审核失败，请重试');
    }
  };

  // 取消审核
  const handleCancelReview = async (logId: string) => {
    const notes = prompt('请输入取消原因（可选）:');
    try {
      const success = await autoAiReviewService.cancelReview(logId, notes || undefined);
      if (success) {
        alert('审核已取消');
        // 重新加载日志
        const logs = await autoAiReviewService.getReviewLogs();
        setReviewLogs(logs);
      } else {
        alert('取消审核失败');
      }
    } catch (error) {
      console.error('取消审核失败:', error);
      alert('取消审核失败，请重试');
    }
  };

  // 批量审核通过
  const handleApprove = async () => {
    if (selectedIds.length === 0) return;
    
    // 检查是否有AI审核结果和优化建议
    const toolsWithAI = selectedIds.filter(id => aiReviews[id]);
    const toolsWithOptimizations = toolsWithAI.filter(id => {
      const review = aiReviews[id];
      return review?.optimized_name || review?.optimized_tagline || review?.optimized_description || review?.suggested_tags;
    });
    
    let confirmMessage = `确定要审核通过这 ${selectedIds.length} 个工具吗？`;
    
    if (toolsWithOptimizations.length > 0) {
      confirmMessage += `\n\n🤖 系统将自动应用AI优化建议到 ${toolsWithOptimizations.length} 个工具，包括：\n• 优化后的名称、简介\n• 改进的标签建议\n• 自动获取工具头像`;
    }
    
    if (!confirm(confirmMessage)) return;
    
    setProcessing(true);
    try {
      console.log('开始审核，选中的ID:', selectedIds);
      
      // 获取选中的工具详情
      const { data: selectedTools, error: fetchError } = await supabase
        .from('tool_submissions')
        .select('*')
        .in('id', selectedIds);

      if (fetchError) {
        console.error('获取工具详情失败:', fetchError);
        alert('获取工具详情失败');
        return;
      }

      console.log('获取到的工具:', selectedTools);

      if (selectedTools && selectedTools.length > 0) {
        // 逐个插入到主表，使用直接插入
        let successCount = 0;
        for (const tool of selectedTools) {
          // 获取AI审核结果
          const aiReview = aiReviews[tool.id];
          
          // 应用AI优化建议
          const optimizedName = aiReview?.optimized_name && aiReview.optimized_name !== tool.name 
            ? aiReview.optimized_name 
            : tool.name;
          const optimizedTagline = aiReview?.optimized_tagline || tool.tagline;
          const optimizedDescription = aiReview?.optimized_description || tool.tagline;
          const suggestedTags = aiReview?.suggested_tags || [tool.category];
          
          // 获取工具头像
          const logoUrl = getToolLogo(tool.website_url);
          
          const toolToInsert = {
            name: optimizedName,
            tagline: optimizedTagline,
            description: optimizedDescription,
            website_url: tool.website_url,
            logo_url: logoUrl, // 启用logo_url保存
            category: tool.category,
            tags: suggestedTags, // 使用AI建议的标签
            pricing_type: tool.pricing_type,
            is_china_available: tool.is_china_available,
            is_chinese_supported: tool.note?.includes('支持中文: true') || false,
            rating: 0,
            rating_count: 0,
            view_count: 0,
            screenshots: [], // 空数组，Supabase 会自动处理
            status: 'active',
            created_at: new Date().toISOString(),
            // 添加AI质量评估字段
            ai_quality_score: aiReview ? ((aiReview.maturity_score || 5) + (aiReview.interest_score || 5)) / 2 : null,
            ai_quality_review: aiReview ? JSON.stringify({
              maturity_score: aiReview.maturity_score || 5,
              interest_score: aiReview.interest_score || 5,
              quality_assessment: aiReview.quality_assessment || 'AI审核中未提供质量评估',
              reasoning: aiReview.reasoning || '',
              confidence: aiReview.confidence || 0,
              recommendation: aiReview.recommendation || 'manual_review',
              // 记录原始信息和优化建议
              original_name: tool.name,
              original_tagline: tool.tagline,
              optimized_name: aiReview?.optimized_name,
              optimized_tagline: aiReview?.optimized_tagline,
              optimized_description: aiReview?.optimized_description,
              suggested_tags: aiReview?.suggested_tags
            }) : null,
            ai_review_date: aiReview ? new Date().toISOString() : null,
            ai_review_notes: aiReview ? `AI审核建议: ${aiReview.recommendation}。${aiReview.quality_assessment ? ' 质量评估: ' + aiReview.quality_assessment : ''}${aiReview.optimized_name ? '\n优化建议: 名称、简介、标签等已优化' : ''}` : null
          };

          console.log('插入工具（包含AI审核数据）:', toolToInsert);

          // 直接插入到 tools 表
          const { data, error } = await supabase
            .from('tools')
            .insert(toolToInsert);

          if (error) {
            console.error(`插入工具 ${tool.name} 失败:`, error);
            console.error('错误详情:', error.details);
            console.error('错误代码:', error.code);
            // 继续处理其他工具，不中断整个流程
            continue;
          } else {
            console.log(`成功插入工具 ${tool.name}`);
            successCount++;
          }
        }

        console.log(`成功插入 ${successCount} 个工具，开始更新状态`);

        // 更新待审核表状态
        const { error: updateError } = await supabase
          .from('tool_submissions')
          .update({ status: 'approved' })
          .in('id', selectedIds);

        if (updateError) {
          console.error('更新状态失败:', updateError);
          alert('更新状态失败');
        } else {
          console.log('状态更新成功，重新获取数据');
          // 重新获取所有状态的数据
          const { data: refreshedData } = await supabase
            .from('tool_submissions')
            .select('*')
            .order('created_at', { ascending: false });
          
          setSubmissions(refreshedData || []);
          setSelectedIds([]);
          
          // 统计优化应用情况
          const optimizedTools = selectedTools.filter(tool => {
            const aiReview = aiReviews[tool.id];
            return aiReview?.optimized_name || aiReview?.optimized_tagline || aiReview?.optimized_description || aiReview?.suggested_tags;
          });
          
          let successMessage = `✅ 成功审核通过 ${successCount} 个工具！`;
          
          if (optimizedTools.length > 0) {
            successMessage += `\n\n🤖 AI优化已应用到 ${optimizedTools.length} 个工具：\n• 自动优化名称和简介\n• 改进标签建议\n• 获取工具头像`;
          }
          
          alert(successMessage);
        }
      }
    } catch (err) {
      console.error('审核失败:', err);
      alert('审核失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  // 批量拒绝
  const handleReject = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm('确定要拒绝这些工具吗？')) return;
    
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('tool_submissions')
        .update({ status: 'rejected' })
        .in('id', selectedIds);

      if (error) {
        console.error('拒绝失败:', error);
        alert('拒绝失败');
      } else {
        // 重新获取所有状态的数据
        const { data: refreshedData } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        setSubmissions(refreshedData || []);
        setSelectedIds([]);
        alert('已拒绝选中的工具');
      }
    } catch (err) {
      console.error('拒绝失败:', err);
      alert('拒绝失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  // 选择/取消选择
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const currentTabIds = submissions
      .filter(tool => tool.status === activeTab)
      .map(tool => tool.id);
    
    if (selectedIds.length === currentTabIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentTabIds);
    }
  };

  // AI审核单个工具（流式输出）
  const handleAiReview = async (toolId: string) => {
    const tool = submissions.find(t => t.id === toolId);
    if (!tool) return;

    setAiProcessing(prev => [...prev, toolId]);
    setStreamingToolId(toolId);
    setStreamingContent('');
    
    try {
      // 获取现有工具进行重复检测
      const existingTools = submissions.filter(t => t.id !== toolId);
      
      const result = await deepSeekService.reviewToolStream(
        tool, 
        existingTools,
        (chunk: string) => {
          setStreamingContent(prev => prev + chunk);
        }
      );
      
      // 保存AI审核结果到数据库
      const { error: saveError } = await supabase
        .from('tool_submissions')
        .update({
          ai_review_result: result,
          ai_review_date: new Date().toISOString()
        })
        .eq('id', toolId);
      
      if (saveError) {
        console.error('保存AI审核结果失败:', saveError);
        
        // 检查是否是字段不存在的错误
        if (saveError.message.includes('ai_review_result') || saveError.code === 'PGRST204') {
          console.warn('ai_review_result 字段不存在，需要在Supabase控制台手动添加');
          
          // 显示用户友好的错误提示
          const errorMessage = document.createElement('div');
          errorMessage.textContent = '⚠️ 数据库字段缺失，请联系管理员添加AI审核结果存储字段';
          errorMessage.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg z-50 max-w-md';
          document.body.appendChild(errorMessage);
          
          setTimeout(() => {
            if (document.body.contains(errorMessage)) {
              document.body.removeChild(errorMessage);
            }
          }, 5000);
        } else {
          alert('保存AI审核结果失败: ' + saveError.message);
        }
        
        // 即使保存失败，也更新本地状态
      } else {
        console.log('✅ AI审核结果已保存到数据库');
      }
      
      setAiReviews(prev => ({ ...prev, [toolId]: result }));
    } catch (error) {
      console.error('AI审核失败:', error);
      alert('AI审核失败，请重试');
    } finally {
      setAiProcessing(prev => prev.filter(id => id !== toolId));
      setStreamingToolId(null);
      setStreamingContent('');
    }
  };

  // 批量AI审核
  const handleBatchAiReview = async () => {
    if (selectedIds.length === 0) return;
    
    setAiProcessing(selectedIds);
    setBatchReviewProgress({
      current: 0,
      total: selectedIds.length,
      currentTool: '',
      isProcessing: true
    });
    
    try {
      const selectedTools = submissions.filter(t => selectedIds.includes(t.id));
      const results = await deepSeekService.reviewToolsBatch(
        selectedTools,
        (current, toolName) => {
          // 更新进度显示
          setBatchReviewProgress(prev => ({
            ...prev,
            current,
            currentTool: toolName
          }));
          console.log(`批量审核进度: ${current}/${selectedTools.length} - ${toolName}`);
        }
      );
      
      const newReviews: AIReviewCache = {};
      results.forEach(({ toolId, result }) => {
        newReviews[toolId] = result;
      });
      
      setAiReviews(prev => ({ ...prev, ...newReviews }));
      
      const successCount = results.filter(r => r.result.recommendation !== 'manual_review').length;
      const failCount = results.length - successCount;
      
      setBatchReviewProgress(prev => ({ ...prev, isProcessing: false }));
      alert(`批量审核完成！\n✅ 成功: ${successCount} 个\n❌ 失败: ${failCount} 个\n📊 总计: ${results.length} 个`);
    } catch (error) {
      console.error('批量AI审核失败:', error);
      setBatchReviewProgress(prev => ({ ...prev, isProcessing: false }));
      alert('批量AI审核失败，请重试\n错误信息: ' + error.message);
    } finally {
      setAiProcessing([]);
    }
  };

  // 应用AI优化建议
  const handleApplyOptimization = async (toolId: string) => {
    const review = aiReviews[toolId];
    const tool = submissions.find(t => t.id === toolId);
    
    if (!review || !tool) {
      alert('未找到AI审核结果或工具信息');
      return;
    }

    // 确认对话框
    const confirmed = window.confirm(
      `确定要应用AI优化建议吗？\n\n` +
      `原名称: ${tool.name}\n` +
      `优化名称: ${review.optimized_name || '无'}\n\n` +
      `原简介: ${tool.tagline}\n` +
      `优化简介: ${review.optimized_tagline || '无'}`
    );

    if (!confirmed) return;

    try {
      // 显示加载状态
      const loadingMessage = document.createElement('div');
      loadingMessage.textContent = '正在应用优化建议...';
      loadingMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-50';
      document.body.appendChild(loadingMessage);

      const { error } = await supabase
        .from('tool_submissions')
        .update({
          name: review.optimized_name || tool.name,
          tagline: review.optimized_tagline || tool.tagline,
          note: `${tool.note || ''}\n\nAI优化建议:\n${review.reasoning}`
        })
        .eq('id', toolId);

      // 移除加载提示
      document.body.removeChild(loadingMessage);

      if (error) {
        console.error('应用AI优化失败:', error);
        
        // 显示错误提示
        const errorMessage = document.createElement('div');
        errorMessage.textContent = '应用AI优化失败';
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50';
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
          document.body.removeChild(errorMessage);
        }, 3000);
      } else {
        // 显示成功提示
        const successMessage = document.createElement('div');
        successMessage.textContent = '✅ AI优化建议已应用';
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
        
        // 重新加载数据
        const { data: refreshedData } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        setSubmissions(refreshedData || []);
        
        // 关闭详情弹窗
        setShowAiReview(null);
      }
    } catch (error) {
      console.error('应用AI优化异常:', error);
      
      // 显示错误提示
      const errorMessage = document.createElement('div');
      errorMessage.textContent = '应用AI优化失败';
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  // 复制AI优化内容
  const copyAiContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      alert('内容已复制到剪贴板');
    });
  };

  // 获取当前标签页的数据
  const currentTabSubmissions = submissions.filter(tool => tool.status === activeTab);
  const pendingCount = submissions.filter(tool => tool.status === 'pending').length;
  const approvedCount = submissions.filter(tool => tool.status === 'approved').length;
  const rejectedCount = submissions.filter(tool => tool.status === 'rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">加载中...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>审核管理 - AI创客</title>
        <meta name="description" content="AI工具审核管理后台" />
      </Helmet>
      
      <main className="mx-auto max-w-[1400px] px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛠️ 审核管理</h1>
          <p className="text-muted-foreground">管理待审核的AI工具提交</p>
        </div>

        {/* AI审核结果筛选 */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">AI审核筛选:</span>
          </div>
          <Select value={aiReviewFilter} onValueChange={(value: 'all' | 'approve' | 'manual_review' | 'reject') => setAiReviewFilter(value)}>
            <SelectTrigger className="w-48">
              {aiReviewFilter === 'all' && '全部'}
              {aiReviewFilter === 'approve' && '✅ 通过'}
              {aiReviewFilter === 'manual_review' && '🤖 人工审核'}
              {aiReviewFilter === 'reject' && '❌ 拒绝'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="approve">✅ 通过</SelectItem>
              <SelectItem value="manual_review">🤖 人工审核</SelectItem>
              <SelectItem value="reject">❌ 拒绝</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 来源筛选 */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">来源筛选:</span>
          </div>
          <input
            type="text"
            placeholder="输入来源关键词进行模糊搜索..."
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md w-80"
          />
          {sourceFilter && (
            <button
              onClick={() => setSourceFilter('')}
              className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              清除
            </button>
          )}
        </div>

        {/* 状态标签页 */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pending' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            待审核 ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'approved' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            已通过 ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'rejected' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            已拒绝 ({rejectedCount})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'logs' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            AI审核日志 ({reviewLogs.filter(l => l.status === 'pending').length})
          </button>
        </div>

        {/* 自动AI审核按钮 */}
        <div className="mb-6">
          <Button
            onClick={handleAutoReview}
            disabled={autoReviewProcessing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            {autoReviewProcessing ? 'AI审核中...' : '开始自动AI审核'}
          </Button>
        </div>

        {/* 批量操作 - 只在待审核页面显示 */}
        {activeTab === 'pending' && currentTabSubmissions.length > 0 && (
          <div className="space-y-4 mb-6">
            {/* 自动AI审核进度显示 */}
            {autoReviewProgress.status !== 'idle' && (
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900">
                          🤖 自动AI审核进度
                        </span>
                        <span className="text-sm text-purple-700">
                          {autoReviewProgress.current} / {autoReviewProgress.total}
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: autoReviewProgress.total > 0 
                              ? `${(autoReviewProgress.current / autoReviewProgress.total) * 100}%` 
                              : '0%' 
                          }}
                        />
                      </div>
                      <div className="mt-2 text-sm text-purple-700">
                        当前处理: {autoReviewProgress.currentTool}
                      </div>
                    </div>
                    {autoReviewProgress.status === 'processing' && (
                      <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full" />
                    )}
                    {autoReviewProgress.status === 'completed' && (
                      <div className="text-green-600">✅</div>
                    )}
                    {autoReviewProgress.status === 'error' && (
                      <div className="text-red-600">❌</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex items-center gap-4 flex-wrap">
              <Button
                variant="outline"
                onClick={toggleSelectAll}
                disabled={autoReviewProcessing}
              >
                {selectedIds.length === currentTabSubmissions.length ? '取消全选' : '全选'}
              </Button>
              <Button
                onClick={handleBatchAiReview}
                disabled={selectedIds.length === 0 || aiProcessing.length > 0 || autoReviewProcessing || batchReviewProgress.isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Bot className="h-4 w-4 mr-2" />
                批量AI审核 ({selectedIds.length})
              </Button>
              
              {/* 批量审核进度显示 */}
              {batchReviewProgress.isProcessing && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">
                      批量AI审核进行中...
                    </span>
                    <span className="text-sm text-purple-600">
                      {batchReviewProgress.current}/{batchReviewProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(batchReviewProgress.current / batchReviewProgress.total) * 100}%` }}
                    />
                  </div>
                  {batchReviewProgress.currentTool && (
                    <p className="text-xs text-purple-700">
                      正在审核: {batchReviewProgress.currentTool}
                    </p>
                  )}
                  <p className="text-xs text-purple-600 mt-1">
                    预计剩余时间: {Math.ceil((batchReviewProgress.total - batchReviewProgress.current) * 3)}秒
                  </p>
                </div>
              )}
              <Button
                onClick={handleApprove}
                disabled={selectedIds.length === 0 || processing || autoReviewProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                批量通过 ({selectedIds.length})
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={selectedIds.length === 0 || processing || autoReviewProcessing}
              >
                <X className="h-4 w-4 mr-2" />
                批量拒绝 ({selectedIds.length})
              </Button>
            </div>
          </div>
        )}

        {/* 工具表格 */}
        {currentTabSubmissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {activeTab === 'pending' && '📋 待审核工具'}
                {activeTab === 'approved' && '✅ 已通过工具'}
                {activeTab === 'rejected' && '❌ 已拒绝工具'}
                ({currentTabSubmissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      {activeTab === 'pending' && (
                        <th className="text-left p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.length === currentTabSubmissions.length}
                            onChange={toggleSelectAll}
                            className="h-4 w-4"
                          />
                        </th>
                      )}
                      <th className="text-left p-3">工具信息</th>
                      <th className="text-left p-3">分类</th>
                      <th className="text-left p-3">状态</th>
                      <th className="text-left p-3">AI审核</th>
                      <th className="text-left p-3">提交时间</th>
                      {activeTab === 'pending' && <th className="text-left p-3">操作</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTabSubmissions.map((tool) => (
                      <tr 
                        key={tool.id}
                        className={`border-b hover:bg-muted/50 transition-colors ${
                          selectedIds.includes(tool.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        {activeTab === 'pending' && (
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(tool.id)}
                              onChange={() => toggleSelection(tool.id)}
                              className="h-4 w-4"
                            />
                          </td>
                        )}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={getToolLogo(tool.website_url)} 
                              alt={tool.name}
                              className="w-8 h-8 rounded-lg border"
                              onError={(e) => {
                                // 静默处理图标加载错误，使用fallback
                                const fallbackUrl = getFallbackLogo(tool.website_url);
                                if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                                  e.currentTarget.src = fallbackUrl;
                                } else {
                                  // 如果fallback也失败，隐藏图片或使用默认图标
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent && !parent.querySelector('.fallback-icon')) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'fallback-icon w-8 h-8 rounded-lg border bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600';
                                    fallback.textContent = tool.name.charAt(0).toUpperCase();
                                    parent.insertBefore(fallback, e.currentTarget);
                                  }
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{tool.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{tool.tagline}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            {/* 人工审批状态 */}
                            <Badge 
                              variant={tool.status === 'approved' ? 'default' : 
                                       tool.status === 'rejected' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {tool.status === 'approved' ? '✅ 已通过' : 
                               tool.status === 'rejected' ? '❌ 已拒绝' : '⏳ 待审批'}
                            </Badge>
                            
                            {/* AI审核状态 */}
                            {tool.status === 'pending' && (
                              <Badge 
                                variant={aiReviews[tool.id] ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {aiReviews[tool.id] ? '🤖 AI已审核' : '🔄 待AI审核'}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          {/* AI审核结果详情 */}
                          {aiReviews[tool.id] ? (
                            <div className="flex flex-col gap-1">
                              <Badge 
                                variant={aiReviews[tool.id].recommendation === 'approve' ? 'default' : 
                                         aiReviews[tool.id].recommendation === 'reject' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {aiReviews[tool.id].recommendation === 'approve' && '✅ 通过'}
                                {aiReviews[tool.id].recommendation === 'reject' && '❌ 拒绝'}
                                {aiReviews[tool.id].recommendation === 'manual_review' && '🤖 人工'}
                              </Badge>
                              {aiReviews[tool.id].maturity_score && (
                                <span className="text-xs text-muted-foreground">
                                  评分: {aiReviews[tool.id].maturity_score}/10
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">未审核</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {new Date(tool.created_at).toLocaleDateString()}
                        </td>
                        {activeTab === 'pending' && (
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  console.log('点击详情按钮:', tool.id, tool.name);
                                  setShowAiReview(tool.id);
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                详情
                              </Button>
                              
                              {aiProcessing.includes(tool.id) ? (
                                <div className="flex items-center gap-1">
                                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                  <span className="text-xs text-muted-foreground">AI审核中</span>
                                </div>
                              ) : aiReviews[tool.id] ? (
                                <div className="flex items-center gap-1">
                                  <Badge 
                                    variant={aiReviews[tool.id].recommendation === 'approve' ? 'default' : 
                                             aiReviews[tool.id].recommendation === 'reject' ? 'destructive' : 'secondary'}
                                    className="text-xs cursor-pointer"
                                    onClick={() => setShowAiReview(tool.id)}
                                  >
                                    {aiReviews[tool.id].recommendation === 'approve' ? '👍 通过' : 
                                     aiReviews[tool.id].recommendation === 'reject' ? '👎 拒绝' : '🤔 人工'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    ({(aiReviews[tool.id].confidence * 100).toFixed(0)}%)
                                  </span>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAiReview(tool.id)}
                                  className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700"
                                >
                                  <Bot className="h-3 w-3 mr-1" />
                                  AI审核
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {currentTabSubmissions.length === 0 && activeTab !== 'logs' && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                {activeTab === 'pending' && '暂无待审核工具'}
                {activeTab === 'approved' && '暂无已通过工具'}
                {activeTab === 'rejected' && '暂无已拒绝工具'}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI审核日志页面 */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* 日志页面头部 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">📊 AI审核日志</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  查看所有AI审核记录和执行状态
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  自动刷新: 30秒
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const logs = await autoAiReviewService.getReviewLogs();
                    setReviewLogs(logs);
                  }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  刷新
                </Button>
              </div>
            </div>
            
            {reviewLogs.length > 0 ? (
              reviewLogs.map((log) => (
                <Card key={log.id} className={`border-l-4 ${
                  log.status === 'pending' ? 'border-l-orange-500' :
                  log.status === 'confirmed' ? 'border-l-blue-500' :
                  log.status === 'executed' ? 'border-l-green-500' :
                  'border-l-gray-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">
                            {new Date(log.review_date).toLocaleDateString('zh-CN')} 的AI审核
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              log.status === 'pending' ? 'secondary' :
                              log.status === 'confirmed' ? 'default' :
                              log.status === 'executed' ? 'default' :
                              'outline'
                            }>
                              {log.status === 'pending' ? '待确认' :
                               log.status === 'confirmed' ? '已确认' :
                               log.status === 'executed' ? '已执行' :
                               '已取消'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmReview(log.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              执行审核
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelReview(log.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              取消
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowReviewLog(log)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{log.total_tools}</div>
                        <div className="text-sm text-muted-foreground">总工具数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{log.approved_count}</div>
                        <div className="text-sm text-muted-foreground">建议通过</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{log.rejected_count}</div>
                        <div className="text-sm text-muted-foreground">建议拒绝</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{log.manual_review_count}</div>
                        <div className="text-sm text-muted-foreground">需人工审核</div>
                      </div>
                    </div>
                    
                    {log.summary && (
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <div className="font-medium mb-2">审核摘要:</div>
                        <pre className="whitespace-pre-wrap text-xs">{log.summary}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground">
                    暂无AI审核日志
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* AI审核结果弹窗 */}
        {showAiReview && (() => {
          const tool = submissions.find(t => t.id === showAiReview);
          const review = aiReviews[showAiReview];
          
          console.log('弹窗调试:', {
            showAiReview,
            toolFound: !!tool,
            reviewFound: !!review,
            toolId: tool?.id,
            toolName: tool?.name,
            submissionsLength: submissions.length
          });
          
          if (!tool) {
            return (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">未找到工具信息</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      调试信息: showAiReview={showAiReview}, submissions数量={submissions.length}
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowAiReview(null)}
                    >
                      关闭
                    </Button>
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Bot className="h-5 w-5 text-purple-600" />
                      工具详情与AI审核
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAiReview(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* 工具基本信息 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">📋 工具基本信息</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">核心信息</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>名称:</strong> {tool?.name}</p>
                              <p><strong>简介:</strong> {tool?.tagline}</p>
                              <p><strong>分类:</strong> <Badge variant="outline">{tool?.category}</Badge></p>
                              <p><strong>价格:</strong> <Badge variant="secondary">{tool?.pricing_type}</Badge></p>
                              <p><strong>国内可用:</strong> 
                                <Badge variant={tool?.is_china_available ? 'default' : 'secondary'}>
                                  {tool?.is_china_available ? '🇨🇳 可用' : '🌍 需翻墙'}
                                </Badge>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">链接与备注</h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>官网:</strong>{' '}
                                <a 
                                  href={tool?.website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1 inline"
                                >
                                  访问网站
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </p>
                              <p><strong>提交时间:</strong> {new Date(tool?.created_at || '').toLocaleString()}</p>
                              <p><strong>当前状态:</strong> 
                                <Badge 
                                  variant={tool?.status === 'approved' ? 'default' : 
                                           tool?.status === 'rejected' ? 'destructive' : 'secondary'}
                                >
                                  {tool?.status === 'approved' ? '✅ 已通过' : 
                                   tool?.status === 'rejected' ? '❌ 已拒绝' : '⏳ 待审核'}
                                </Badge>
                              </p>
                              {tool?.note && (
                                <div>
                                  <strong>备注:</strong>
                                  <p className="text-muted-foreground mt-1">{tool.note}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI审核结果 */}
                    {review ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            🤖 AI审核结果
                            <Badge 
                              variant={review.recommendation === 'approve' ? 'default' : 
                                       review.recommendation === 'reject' ? 'destructive' : 'secondary'}
                            >
                              {review.recommendation === 'approve' ? '建议通过' : 
                               review.recommendation === 'reject' ? '建议拒绝' : '需要人工审核'}
                            </Badge>
                            <Badge variant="outline">
                              置信度: {(review.confidence * 100).toFixed(1)}%
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* 质量评分 */}
                          <div>
                            <h4 className="font-semibold mb-3">质量评分</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm">成熟度</span>
                                  <span className="text-sm font-semibold">{review.maturity_score}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(review.maturity_score / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm">有趣度</span>
                                  <span className="text-sm font-semibold">{review.interest_score}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${(review.interest_score / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 质量评估 */}
                          <div>
                            <h4 className="font-semibold mb-2">质量评估</h4>
                            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                              {review.quality_assessment}
                            </p>
                          </div>

                          {/* 重复检测 */}
                          <div>
                            <h4 className="font-semibold mb-2">重复检测</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={review.is_duplicate ? 'destructive' : 'default'}>
                                {review.is_duplicate ? '⚠️ 发现重复' : '✅ 无重复'}
                              </Badge>
                            </div>
                            {review.duplicate_tools && review.duplicate_tools.length > 0 && (
                              <div className="space-y-2">
                                {review.duplicate_tools.map((dup, index) => (
                                  <div key={index} className="text-sm bg-orange-50 p-2 rounded border border-orange-200">
                                    <p><strong>相似工具:</strong> {dup.name}</p>
                                    <p><strong>相似度:</strong> {(dup.similarity * 100).toFixed(1)}%</p>
                                    <p><strong>相似原因:</strong> {dup.similarity_reason}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 优化建议 */}
                          <div>
                            <h4 className="font-semibold mb-2">💡 优化建议</h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-blue-600">优化后的名称:</p>
                                <p className="text-sm bg-blue-50 p-2 rounded">{review.optimized_name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-600">优化后的简介:</p>
                                <p className="text-sm bg-green-50 p-2 rounded">{review.optimized_tagline}</p>
                              </div>
                              {review.optimized_description && (
                                <div>
                                  <p className="text-sm font-medium text-purple-600">优化后的描述:</p>
                                  <p className="text-sm bg-purple-50 p-2 rounded whitespace-pre-wrap">
                                    {review.optimized_description}
                                  </p>
                                </div>
                              )}
                              {review.suggested_tags && review.suggested_tags.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-orange-600">建议标签:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {review.suggested_tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 推理过程 */}
                          <div>
                            <h4 className="font-semibold mb-2">🧠 推理过程</h4>
                            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                              {review.reasoning}
                            </p>
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex items-center gap-2 pt-4 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleApplyOptimization(showAiReview)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              应用优化建议
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyAiContent(review.reasoning)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              复制推理过程
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">暂无AI审核结果</p>
                          
                          {/* 流式输出显示 */}
                          {aiProcessing.includes(showAiReview) && streamingToolId === showAiReview && (
                            <div className="mt-6 text-left">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                <span className="text-sm font-medium">AI正在审核中...</span>
                              </div>
                              
                              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                  <span className="text-xs font-medium text-gray-600">实时思考过程:</span>
                                </div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                  {streamingContent || 'AI正在思考...'}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <Button
                            className="mt-4"
                            onClick={() => handleAiReview(showAiReview)}
                            disabled={aiProcessing.includes(showAiReview)}
                          >
                            {aiProcessing.includes(showAiReview) ? '审核中...' : '开始AI审核'}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 审核日志详情弹窗 */}
        {showReviewLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    AI审核日志详情
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReviewLog(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">审核信息</h4>
                      <p><strong>审核日期:</strong> {new Date(showReviewLog.review_date).toLocaleDateString('zh-CN')}</p>
                      <p><strong>创建时间:</strong> {new Date(showReviewLog.created_at).toLocaleString()}</p>
                      <p><strong>状态:</strong> 
                        <Badge variant={
                          showReviewLog.status === 'pending' ? 'secondary' :
                          showReviewLog.status === 'confirmed' ? 'default' :
                          showReviewLog.status === 'executed' ? 'default' :
                          'outline'
                        } className="ml-2">
                          {showReviewLog.status === 'pending' ? '待确认' :
                           showReviewLog.status === 'confirmed' ? '已确认' :
                           showReviewLog.status === 'executed' ? '已执行' :
                           '已取消'}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">统计结果</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>总工具数: <strong>{showReviewLog.total_tools}</strong></div>
                        <div>建议通过: <strong className="text-green-600">{showReviewLog.approved_count}</strong></div>
                        <div>建议拒绝: <strong className="text-red-600">{showReviewLog.rejected_count}</strong></div>
                        <div>需人工审核: <strong className="text-orange-600">{showReviewLog.manual_review_count}</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* 审核摘要 */}
                  {showReviewLog.summary && (
                    <div>
                      <h4 className="font-semibold mb-2">审核摘要</h4>
                      <div className="bg-gray-50 p-4 rounded text-sm">
                        <pre className="whitespace-pre-wrap">{showReviewLog.summary}</pre>
                      </div>
                    </div>
                  )}

                  {/* 详细审核结果 */}
                  <div>
                    <h4 className="font-semibold mb-2">详细审核结果</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {showReviewLog.review_results.map((result, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{result.tool_name}</h5>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                result.ai_recommendation === 'approve' ? 'default' :
                                result.ai_recommendation === 'reject' ? 'destructive' :
                                'secondary'
                              }>
                                {result.ai_recommendation === 'approve' ? '建议通过' :
                                 result.ai_recommendation === 'reject' ? '建议拒绝' :
                                 '需人工审核'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                置信度: {(result.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                            <div>
                              <span className="text-muted-foreground">成熟度:</span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: `${result.maturity_score * 10}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{result.maturity_score}/10</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">有趣度:</span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-600 h-1.5 rounded-full" 
                                    style={{ width: `${result.interest_score * 10}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{result.interest_score}/10</span>
                              </div>
                            </div>
                          </div>

                          {result.is_duplicate && (
                            <div className="text-xs text-red-600 mb-1">
                              ⚠️ 发现重复工具
                            </div>
                          )}

                          {(result.optimized_name || result.optimized_tagline) && (
                            <div className="text-xs bg-blue-50 p-2 rounded mb-2">
                              {result.optimized_name && (
                                <div><strong>优化名称:</strong> {result.optimized_name}</div>
                              )}
                              {result.optimized_tagline && (
                                <div><strong>优化简介:</strong> {result.optimized_tagline}</div>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            <strong>AI推理:</strong> {result.reasoning}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  {showReviewLog.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => {
                          handleConfirmReview(showReviewLog.id);
                          setShowReviewLog(null);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        执行审核结果
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleCancelReview(showReviewLog.id);
                          setShowReviewLog(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        取消审核
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowReviewLog(null)}
                      >
                        关闭
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
