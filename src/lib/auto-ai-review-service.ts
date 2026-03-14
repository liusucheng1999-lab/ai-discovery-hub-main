// src/lib/auto-ai-review-service.ts
// 自动AI审核服务 - 定时执行审核并生成日志

import { deepSeekService, type AIReviewResult } from './deepseek-service';
import { supabase } from './supabase';
import { notificationService } from './notification-service';

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

interface ReviewLog {
  id: string;
  review_date: string;
  total_tools: number;
  approved_count: number;
  rejected_count: number;
  manual_review_count: number;
  review_results: Array<{
    tool_id: string;
    tool_name: string;
    ai_recommendation: 'approve' | 'reject' | 'manual_review';
    confidence: number;
    maturity_score: number;
    interest_score: number;
    is_duplicate: boolean;
    reasoning: string;
    optimized_name?: string;
    optimized_tagline?: string;
  }>;
  summary: string;
  status: 'pending' | 'confirmed' | 'executed' | 'cancelled';
  created_at: string;
  confirmed_at?: string;
  executed_at?: string;
  notes?: string;
}

class AutoAiReviewService {
  /**
   * 执行自动AI审核
   */
  async performAutoReview(
    progressCallback?: (current: number, total: number, currentTool: string) => void
  ): Promise<ReviewLog | null> {
    try {
      console.log('开始执行自动AI审核...');
      
      // 获取所有待审核工具
      const { data: pendingTools, error: fetchError } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('获取待审核工具失败:', fetchError);
        return null;
      }

      if (!pendingTools || pendingTools.length === 0) {
        console.log('没有待审核的工具');
        return null;
      }

      console.log(`找到 ${pendingTools.length} 个待审核工具`);
      
      // 通知开始
      progressCallback?.(0, pendingTools.length, '开始AI审核...');

      // 批量AI审核
      const reviewResults = await deepSeekService.instance.reviewToolsBatch(
        pendingTools,
        (current, toolName) => {
          progressCallback?.(current, pendingTools.length, `正在审核: ${toolName}`);
        }
      );
      
      // 通知完成
      progressCallback?.(pendingTools.length, pendingTools.length, '审核完成，正在生成报告...');
      
      // 统计结果
      let approvedCount = 0;
      let rejectedCount = 0;
      let manualReviewCount = 0;
      
      const formattedResults = reviewResults.map(({ toolId, result }) => {
        const tool = pendingTools.find(t => t.id === toolId);
        
        switch (result.recommendation) {
          case 'approve':
            approvedCount++;
            break;
          case 'reject':
            rejectedCount++;
            break;
          case 'manual_review':
            manualReviewCount++;
            break;
        }

        return {
          tool_id: toolId,
          tool_name: tool?.name || '未知工具',
          ai_recommendation: result.recommendation,
          confidence: result.confidence,
          maturity_score: result.maturity_score,
          interest_score: result.interest_score,
          is_duplicate: result.is_duplicate,
          reasoning: result.reasoning,
          optimized_name: result.optimized_name,
          optimized_tagline: result.optimized_tagline
        };
      });

      // 生成审核摘要
      const summary = this.generateReviewSummary(formattedResults, pendingTools.length);

      // 创建审核日志
      const { data: reviewLog, error: insertError } = await supabase
        .from('ai_review_logs')
        .insert({
          review_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD格式
          total_tools: pendingTools.length,
          approved_count: approvedCount,
          rejected_count: rejectedCount,
          manual_review_count: manualReviewCount,
          review_results: formattedResults,
          summary: summary,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('创建审核日志失败:', insertError);
        return null;
      }

      console.log('自动AI审核完成，日志ID:', reviewLog.id);
      
      // 发送通知
      await this.sendReviewNotification(reviewLog);
      
      // 使用通知服务发送通知
      await notificationService.sendReviewCompletedNotification(reviewLog);

      return reviewLog;
    } catch (error) {
      console.error('自动AI审核失败:', error);
      return null;
    }
  }

  /**
   * 生成审核摘要
   */
  private generateReviewSummary(results: any[], totalTools: number): string {
    const approvedCount = results.filter(r => r.ai_recommendation === 'approve').length;
    const rejectedCount = results.filter(r => r.ai_recommendation === 'reject').length;
    const manualReviewCount = results.filter(r => r.ai_recommendation === 'manual_review').length;
    const duplicateCount = results.filter(r => r.is_duplicate).length;
    
    const highQualityTools = results.filter(r => 
      r.maturity_score >= 7 && r.interest_score >= 7
    ).length;

    let summary = `AI自动审核报告\n`;
    summary += `================\n\n`;
    summary += `📊 审核统计:\n`;
    summary += `- 总工具数: ${totalTools}\n`;
    summary += `- 建议通过: ${approvedCount} (${(approvedCount/totalTools*100).toFixed(1)}%)\n`;
    summary += `- 建议拒绝: ${rejectedCount} (${(rejectedCount/totalTools*100).toFixed(1)}%)\n`;
    summary += `- 需人工审核: ${manualReviewCount} (${(manualReviewCount/totalTools*100).toFixed(1)}%)\n`;
    summary += `- 发现重复: ${duplicateCount} (${(duplicateCount/totalTools*100).toFixed(1)}%)\n`;
    summary += `- 高质量工具: ${highQualityTools} (${(highQualityTools/totalTools*100).toFixed(1)}%)\n\n`;

    // 推荐通过的优质工具
    const approvedHighQuality = results.filter(r => 
      r.ai_recommendation === 'approve' && 
      r.maturity_score >= 7 && 
      r.interest_score >= 7 &&
      !r.is_duplicate
    );
    
    if (approvedHighQuality.length > 0) {
      summary += `⭐ 推荐通过的优质工具:\n`;
      approvedHighQuality.slice(0, 5).forEach((tool, index) => {
        summary += `${index + 1}. ${tool.tool_name} (成熟度:${tool.maturity_score}/10, 有趣度:${tool.interest_score}/10)\n`;
      });
      if (approvedHighQuality.length > 5) {
        summary += `   ... 还有 ${approvedHighQuality.length - 5} 个优质工具\n`;
      }
      summary += `\n`;
    }

    // 需要关注的工具
    const needsAttention = results.filter(r => 
      r.ai_recommendation === 'manual_review' || 
      r.is_duplicate || 
      r.confidence < 0.7
    );
    
    if (needsAttention.length > 0) {
      summary += `⚠️ 需要关注的工具:\n`;
      needsAttention.slice(0, 5).forEach((tool, index) => {
        let reason = '';
        if (tool.is_duplicate) reason = '[重复] ';
        if (tool.confidence < 0.7) reason = '[低置信度] ';
        if (tool.ai_recommendation === 'manual_review') reason = '[需人工] ';
        summary += `${index + 1}. ${reason}${tool.tool_name}\n`;
      });
      if (needsAttention.length > 5) {
        summary += `   ... 还有 ${needsAttention.length - 5} 个需要关注的工具\n`;
      }
    }

    summary += `\n🤖 AI建议: `;
    if (approvedCount > totalTools * 0.6) {
      summary += '本次提交的工具质量较高，建议优先处理推荐通过的工具。';
    } else if (rejectedCount > totalTools * 0.5) {
      summary += '本次提交的工具质量较低，建议提高审核标准。';
    } else {
      summary += '本次提交的工具质量一般，建议仔细评估每个工具。';
    }

    return summary;
  }

  /**
   * 发送审核通知
   */
  private async sendReviewNotification(reviewLog: ReviewLog): Promise<void> {
    try {
      // 这里可以集成邮件服务、webhook、或其他通知方式
      console.log('发送审核通知:', {
        logId: reviewLog.id,
        totalTools: reviewLog.total_tools,
        approvedCount: reviewLog.approved_count,
        rejectedCount: reviewLog.rejected_count,
        summary: reviewLog.summary
      });

      // 示例：发送到webhook
      // await fetch('https://your-webhook-url.com/notify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     type: 'ai_review_completed',
      //     data: reviewLog
      //   })
      // });

    } catch (error) {
      console.error('发送审核通知失败:', error);
    }
  }

  /**
   * 确认审核日志并执行审核结果
   */
  async confirmAndExecuteReview(logId: string): Promise<boolean> {
    try {
      console.log('确认并执行审核结果:', logId);

      // 获取审核日志
      const { data: reviewLog, error: fetchError } = await supabase
        .from('ai_review_logs')
        .select('*')
        .eq('id', logId)
        .single();

      if (fetchError || !reviewLog) {
        console.error('获取审核日志失败:', fetchError);
        return false;
      }

      if (reviewLog.status !== 'pending') {
        console.log('审核日志已处理，状态:', reviewLog.status);
        return false;
      }

      // 更新状态为已确认
      const { error: updateError } = await supabase
        .from('ai_review_logs')
        .update({ 
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (updateError) {
        console.error('更新审核日志状态失败:', updateError);
        return false;
      }

      // 执行审核结果
      const success = await this.executeReviewResults(reviewLog.review_results);

      if (success) {
        // 更新状态为已执行
        await supabase
          .from('ai_review_logs')
          .update({ 
            status: 'executed',
            executed_at: new Date().toISOString()
          })
          .eq('id', logId);

        console.log('审核结果执行完成');
        return true;
      }

      // 发送执行完成通知
      await notificationService.sendReviewExecutedNotification(reviewLog);

      return false;
    } catch (error) {
      console.error('确认并执行审核失败:', error);
      return false;
    }
  }

  /**
   * 执行具体的审核结果
   */
  private async executeReviewResults(reviewResults: any[]): Promise<boolean> {
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const result of reviewResults) {
        try {
          if (result.ai_recommendation === 'approve') {
            // 通过审核，直接更新tools表状态为approved
            const { error: updateError } = await supabase
              .from('tools')
              .update({ 
                status: 'approved',
                ai_review_date: new Date().toISOString()
              })
              .eq('id', result.tool_id);

            if (updateError) {
              console.error(`更新工具 ${result.tool_id} 失败:`, updateError);
              errorCount++;
            } else {
              successCount++;
            }
          } else if (result.ai_recommendation === 'reject') {
            // 拒绝审核
            const { error } = await supabase
              .from('tools')
              .update({ 
                status: 'rejected',
                ai_review_date: new Date().toISOString()
              })
              .eq('id', result.tool_id);

            if (error) {
              console.error(`拒绝工具 ${result.tool_id} 失败:`, error);
              errorCount++;
            } else {
              successCount++;
            }
          }
          // manual_review 的工具保持 pending 状态
        } catch (error) {
          console.error(`处理工具 ${result.tool_id} 失败:`, error);
          errorCount++;
        }
      }

      console.log(`审核结果执行完成: 成功 ${successCount}, 失败 ${errorCount}`);
      return errorCount === 0;
    } catch (error) {
      console.error('执行审核结果失败:', error);
      return false;
    }
  }

  /**
   * 取消审核日志
   */
  async cancelReview(logId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_review_logs')
        .update({ 
          status: 'cancelled',
          notes: notes
        })
        .eq('id', logId);

      if (error) {
        console.error('取消审核失败:', error);
        return false;
      }

      console.log('审核已取消:', logId);
      return true;
    } catch (error) {
      console.error('取消审核异常:', error);
      return false;
    }
  }

  /**
   * 获取审核日志列表
   */
  async getReviewLogs(limit: number = 50): Promise<ReviewLog[]> {
    try {
      const { data, error } = await supabase
        .from('ai_review_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('获取审核日志失败:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('获取审核日志异常:', error);
      return [];
    }
  }

  /**
   * 获取待处理的审核日志
   */
  async getPendingReviewLogs(): Promise<ReviewLog[]> {
    try {
      const { data, error } = await supabase
        .from('ai_review_logs')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取待处理审核日志失败:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('获取待处理审核日志异常:', error);
      return [];
    }
  }
}

export const autoAiReviewService = new AutoAiReviewService();
export type { ReviewLog };
