// src/lib/batch-review-service.ts
// 批量审核后台任务服务

import { supabase } from './supabase';
import { deepSeekService } from './deepseek-service';

export interface BatchReviewTask {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  total_tools: number;
  completed_tools: number;
  current_tool_name?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_by?: string;
  tool_ids: string[];
  results: Record<string, any>;
}

export interface BatchReviewProgress {
  taskId: string;
  status: string;
  current: number;
  total: number;
  currentTool: string;
  isProcessing: boolean;
  error?: string;
}

export class BatchReviewService {
  private static instance: BatchReviewService;
  private activeTasks = new Map<string, NodeJS.Timeout>();

  static getInstance(): BatchReviewService {
    if (!BatchReviewService.instance) {
      BatchReviewService.instance = new BatchReviewService();
    }
    return BatchReviewService.instance;
  }

  /**
   * 提交批量审核任务
   */
  async submitBatchReviewTask(
    toolIds: string[],
    createdBy?: string
  ): Promise<{ taskId: string; message: string }> {
    try {
      // 创建任务记录
      const { data: task, error: taskError } = await supabase
        .from('batch_review_tasks')
        .insert({
          status: 'pending',
          total_tools: toolIds.length,
          completed_tools: 0,
          created_by: createdBy,
          tool_ids: toolIds
        })
        .select()
        .single();

      if (taskError) {
        console.error('创建任务失败:', taskError);
        throw new Error('创建任务失败: ' + taskError.message);
      }

      console.log('批量审核任务已创建:', task.id);

      // 自动开始执行任务
      setTimeout(() => {
        this.startTask(task.id).catch(console.error);
      }, 1000); // 延迟1秒开始执行，确保任务创建完成

      return {
        taskId: task.id,
        message: `批量审核任务已创建并自动开始执行，任务ID: ${task.id}`
      };
    } catch (error) {
      console.error('提交批量审核任务失败:', error);
      throw error;
    }
  }

  /**
   * 手动开始执行任务
   */
  async startTask(taskId: string): Promise<boolean> {
    try {
      // 检查任务状态
      const { data: task, error: taskError } = await supabase
        .from('batch_review_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !task) {
        console.error('获取任务失败:', taskError);
        return false;
      }

      if (task.status !== 'pending' && task.status !== 'stopped') {
        console.log('任务状态不是pending或stopped，无法启动:', task.status);
        return false;
      }

      // 更新状态为运行中
      const { error: updateError } = await supabase
        .from('batch_review_tasks')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (updateError) {
        console.error('更新任务状态失败:', updateError);
        return false;
      }

      // 异步执行任务
      this.executeTask(taskId).catch(console.error);

      console.log('任务已开始执行:', taskId);
      return true;
    } catch (error) {
      console.error('启动任务失败:', error);
      return false;
    }
  }

  /**
   * 执行批量审核任务
   */
  private async executeTask(taskId: string): Promise<void> {
    try {
      console.log('开始执行批量审核任务:', taskId);

      // 获取任务详情
      const { data: task, error: taskError } = await supabase
        .from('batch_review_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !task) {
        console.error('获取任务详情失败:', taskError);
        throw new Error('获取任务详情失败');
      }

      // 获取工具详情（从tools表获取）
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .in('id', task.tool_ids);

      if (toolsError || !tools) {
        console.error('获取工具详情失败:', toolsError);
        throw new Error('获取工具详情失败');
      }

      console.log(`开始审核 ${tools.length} 个工具`);

      // 逐个审核工具
      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        
        try {
          // 更新进度
          const { error: progressError } = await supabase
            .from('batch_review_tasks')
            .update({
              completed_tools: i + 1,
              current_tool_name: tool.name,
              updated_at: new Date().toISOString()
            })
            .eq('id', taskId);

          if (progressError) {
            console.error('更新进度失败:', progressError);
            // 继续执行，不中断任务
          }

          console.log(`审核工具 ${i + 1}/${tools.length}: ${tool.name}`);

          // 调用AI审核
          const result = await deepSeekService.instance.reviewTool(tool);

          // 保存审核结果到ai_review_results表
          const { error: saveError } = await supabase
            .from('ai_review_results')
            .insert({
              task_id: taskId,
              tool_id: tool.id,
              tool_name: tool.name,
              review_result: result,
              status: 'completed'  // 添加状态字段
            });

          if (saveError) {
            console.error('保存审核结果失败:', saveError);
            // 继续执行，不中断任务
          }

          // 更新tools表中的AI审核结果和状态
          const { error: updateError } = await supabase
            .from('tools')
            .update({
              ai_review_result: result,
              ai_review_date: new Date().toISOString(),
              // 只保留质量评估字段
              ai_review_notes: result.quality_assessment || '',
              // 根据AI审核结果更新状态
              status: result?.recommendation === 'approve' ? 'approved' : 
                     result?.recommendation === 'reject' ? 'rejected' : 'pending'
            })
            .eq('id', tool.id);

          if (updateError) {
            console.error('更新tools表失败:', updateError);
            // 继续执行，不中断任务
          } else {
            console.log(`已更新AI审核结果到tools表: ${tool.name}`);
          }

          // 更新任务结果
          const { error: updateResultsError } = await supabase
            .from('batch_review_tasks')
            .update({
              results: {
                ...task.results,
                [tool.id]: result
              }
            })
            .eq('id', taskId);

          if (updateResultsError) {
            console.error('更新任务结果失败:', updateResultsError);
            // 继续执行，不中断任务
          }

          // 添加延迟避免API限制
          if (i < tools.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

        } catch (error) {
          console.error(`审核工具 ${tool.name} 失败:`, error);
          
          // 保存失败结果到ai_review_results表
          try {
            await supabase
              .from('ai_review_results')
              .insert({
                task_id: taskId,
                tool_id: tool.id,
                tool_name: tool.name,
                review_result: {
                  is_mature: false,
                  is_interesting: false,
                  maturity_score: 5,
                  interest_score: 5,
                  quality_assessment: '审核失败',
                  is_duplicate: false,
                  duplicate_tools: [],
                  recommendation: 'manual_review',
                  confidence: 0,
                  reasoning: `审核异常: ${error}`
                },
                status: 'failed'  // 添加状态字段
              });
          } catch (saveError) {
            console.error('保存失败结果异常:', saveError);
          }
        }
      }

      // 完成任务
      const { error: completeError } = await supabase
        .from('batch_review_tasks')
        .update({
          status: 'completed',
          completed_tools: tools.length,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (completeError) {
        console.error('完成任务失败:', completeError);
        // 手动更新状态
        await supabase
          .from('batch_review_tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', taskId);
      }

      console.log('批量审核任务完成:', taskId);

    } catch (error) {
      console.error('执行批量审核任务失败:', error);
      
      // 标记任务失败
      try {
        await supabase
          .from('batch_review_tasks')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: `任务执行失败: ${error.message || error}`
          })
          .eq('id', taskId);
        
        console.log('任务已标记为失败:', taskId);
      } catch (markError) {
        console.error('标记任务失败异常:', markError);
      }
    }
  }

  /**
   * 获取任务进度
   */
  async getTaskProgress(taskId: string): Promise<BatchReviewProgress | null> {
    try {
      const { data: task, error } = await supabase
        .from('batch_review_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error || !task) {
        return null;
      }

      return {
        taskId: task.id,
        status: task.status,
        current: task.completed_tools,
        total: task.total_tools,
        currentTool: task.current_tool_name || '',
        isProcessing: task.status === 'running',
        error: task.error_message
      };
    } catch (error) {
      console.error('获取任务进度失败:', error);
      return null;
    }
  }

  /**
   * 获取任务结果
   */
  async getTaskResults(taskId: string): Promise<Record<string, any> | null> {
    try {
      const { data: task, error } = await supabase
        .from('batch_review_tasks')
        .select('results, status')
        .eq('id', taskId)
        .single();

      if (error || !task) {
        return null;
      }

      if (task.status !== 'completed') {
        return null;
      }

      return task.results;
    } catch (error) {
      console.error('获取任务结果失败:', error);
      return null;
    }
  }

  /**
   * 停止正在运行的任务
   */
  async stopTask(taskId: string): Promise<boolean> {
    try {
      // 检查任务状态
      const { data: task, error: taskError } = await supabase
        .from('batch_review_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !task) {
        console.error('获取任务失败:', taskError);
        return false;
      }

      if (task.status !== 'running') {
        console.log('任务状态不是running，无法停止:', task.status);
        return false;
      }

      // 更新状态为已停止
      const { error: updateError } = await supabase
        .from('batch_review_tasks')
        .update({
          status: 'stopped',
          completed_at: new Date().toISOString(),
          error_message: '用户手动停止任务'
        })
        .eq('id', taskId);

      if (updateError) {
        console.error('停止任务失败:', updateError);
        return false;
      }

      // 清理定时器（如果有的话）
      const timer = this.activeTasks.get(taskId);
      if (timer) {
        clearTimeout(timer);
        this.activeTasks.delete(taskId);
      }

      console.log('任务已停止:', taskId);
      return true;
    } catch (error) {
      console.error('停止任务失败:', error);
      return false;
    }
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('batch_review_tasks')
        .update({
          status: 'cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('取消任务失败:', error);
        return false;
      }

      // 清理定时器
      const timer = this.activeTasks.get(taskId);
      if (timer) {
        clearTimeout(timer);
        this.activeTasks.delete(taskId);
      }

      return true;
    } catch (error) {
      console.error('取消任务异常:', error);
      return false;
    }
  }

  /**
   * 获取用户的任务列表
   */
  async getUserTasks(createdBy?: string, limit = 10): Promise<BatchReviewTask[]> {
    try {
      let query = supabase
        .from('batch_review_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (createdBy) {
        query = query.eq('created_by', createdBy);
      }

      const { data, error } = await query;

      if (error) {
        console.error('获取任务列表失败:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('获取任务列表异常:', error);
      return [];
    }
  }

  /**
   * 清理旧任务
   */
  async cleanupOldTasks(daysOld = 7): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('batch_review_tasks')
        .delete()
        .in('status', ['completed', 'failed', 'cancelled'])
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        console.error('清理旧任务失败:', error);
      } else {
        console.log(`清理了 ${daysOld} 天前的旧任务`);
      }
    } catch (error) {
      console.error('清理旧任务异常:', error);
    }
  }
}

export const batchReviewService = BatchReviewService.getInstance();
