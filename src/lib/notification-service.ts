// src/lib/notification-service.ts
// 通知服务 - 支持邮件和webhook通知

interface ReviewLog {
  id: string;
  review_date: string;
  total_tools: number;
  approved_count: number;
  rejected_count: number;
  manual_review_count: number;
  review_results: any[];
  summary: string;
  status: string;
  created_at: string;
}

interface NotificationConfig {
  email?: {
    enabled: boolean;
    recipients: string[];
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };
  webhook?: {
    enabled: boolean;
    url: string;
    headers?: Record<string, string>;
  };
}

class NotificationService {
  private config: NotificationConfig;

  constructor() {
    // 从环境变量加载配置
    this.config = {
      email: {
        enabled: import.meta.env.VITE_EMAIL_NOTIFICATIONS_ENABLED === 'true',
        recipients: import.meta.env.VITE_EMAIL_RECIPIENTS?.split(',') || [],
        smtp: {
          host: import.meta.env.VITE_SMTP_HOST || '',
          port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
          secure: import.meta.env.VITE_SMTP_SECURE === 'true',
          auth: {
            user: import.meta.env.VITE_SMTP_USER || '',
            pass: import.meta.env.VITE_SMTP_PASS || ''
          }
        }
      },
      webhook: {
        enabled: import.meta.env.VITE_WEBHOOK_NOTIFICATIONS_ENABLED === 'true',
        url: import.meta.env.VITE_WEBHOOK_URL || '',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AI-Discovery-Hub-Notifier'
        }
      }
    };
  }

  /**
   * 发送审核完成通知
   */
  async sendReviewCompletedNotification(reviewLog: ReviewLog): Promise<void> {
    try {
      console.log('发送审核完成通知:', reviewLog.id);

      // 发送邮件通知
      if (this.config.email?.enabled) {
        await this.sendEmailNotification(reviewLog);
      }

      // 发送webhook通知
      if (this.config.webhook?.enabled) {
        await this.sendWebhookNotification(reviewLog);
      }

      console.log('审核完成通知发送成功');
    } catch (error) {
      console.error('发送审核完成通知失败:', error);
    }
  }

  /**
   * 发送邮件通知
   */
  private async sendEmailNotification(reviewLog: ReviewLog): Promise<void> {
    try {
      const subject = `AI审核完成 - ${reviewLog.total_tools}个工具待确认`;
      const htmlContent = this.generateEmailContent(reviewLog);

      console.log('邮件通知内容预览:', {
        subject,
        recipients: this.config.email?.recipients,
        preview: htmlContent.substring(0, 200) + '...'
      });

      // 这里需要集成邮件发送服务，如nodemailer
      // 由于是前端环境，这里只是模拟
      // 在实际部署时，应该在后端发送邮件
      
      // 示例代码（需要在后端实现）:
      /*
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        host: this.config.email.smtp.host,
        port: this.config.email.smtp.port,
        secure: this.config.email.smtp.secure,
        auth: this.config.email.smtp.auth
      });

      await transporter.sendMail({
        from: this.config.email.smtp.auth.user,
        to: this.config.email.recipients.join(', '),
        subject: subject,
        html: htmlContent
      });
      */

      console.log('邮件通知已准备就绪（需要后端支持）');
    } catch (error) {
      console.error('发送邮件通知失败:', error);
    }
  }

  /**
   * 生成邮件内容
   */
  private generateEmailContent(reviewLog: ReviewLog): string {
    const approvalRate = ((reviewLog.approved_count / reviewLog.total_tools) * 100).toFixed(1);
    const rejectionRate = ((reviewLog.rejected_count / reviewLog.total_tools) * 100).toFixed(1);
    const manualReviewRate = ((reviewLog.manual_review_count / reviewLog.total_tools) * 100).toFixed(1);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI审核完成通知</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #8b5cf6; }
        .stat-label { color: #666; margin-top: 5px; }
        .summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .action-button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; }
        .action-button.secondary { background: #6b7280; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI审核完成通知</h1>
            <p>${new Date(reviewLog.created_at).toLocaleDateString('zh-CN')} 的AI审核已完成</p>
        </div>
        
        <div class="content">
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">${reviewLog.total_tools}</div>
                    <div class="stat-label">总工具数</div>
                </div>
                <div class="stat">
                    <div class="stat-number" style="color: #10b981;">${reviewLog.approved_count}</div>
                    <div class="stat-label">建议通过 (${approvalRate}%)</div>
                </div>
                <div class="stat">
                    <div class="stat-number" style="color: #ef4444;">${reviewLog.rejected_count}</div>
                    <div class="stat-label">建议拒绝 (${rejectionRate}%)</div>
                </div>
                <div class="stat">
                    <div class="stat-number" style="color: #f59e0b;">${reviewLog.manual_review_count}</div>
                    <div class="stat-label">需人工审核 (${manualReviewRate}%)</div>
                </div>
            </div>

            <div class="summary">
                <h3>📋 审核摘要</h3>
                <pre style="white-space: pre-wrap; font-family: monospace; background: #f3f4f6; padding: 10px; border-radius: 4px;">${reviewLog.summary}</pre>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <h3>📝 请确认审核结果</h3>
                <p>请登录管理后台查看详细审核结果并确认执行：</p>
                <a href="${window.location.origin}/admin" class="action-button">
                    查看审核结果
                </a>
                <a href="${window.location.origin}/admin?tab=logs" class="action-button secondary">
                    管理审核日志
                </a>
            </div>
        </div>

        <div class="footer">
            <p>此邮件由AI创客工具导航系统自动发送</p>
            <p>如需帮助，请联系系统管理员</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * 发送webhook通知
   */
  private async sendWebhookNotification(reviewLog: ReviewLog): Promise<void> {
    try {
      const payload = {
        type: 'ai_review_completed',
        timestamp: new Date().toISOString(),
        data: {
          id: reviewLog.id,
          review_date: reviewLog.review_date,
          total_tools: reviewLog.total_tools,
          approved_count: reviewLog.approved_count,
          rejected_count: reviewLog.rejected_count,
          manual_review_count: reviewLog.manual_review_count,
          status: reviewLog.status,
          created_at: reviewLog.created_at,
          approval_rate: ((reviewLog.approved_count / reviewLog.total_tools) * 100).toFixed(1),
          rejection_rate: ((reviewLog.rejected_count / reviewLog.total_tools) * 100).toFixed(1),
          manual_review_rate: ((reviewLog.manual_review_count / reviewLog.total_tools) * 100).toFixed(1),
          summary: reviewLog.summary
        }
      };

      const response = await fetch(this.config.webhook!.url, {
        method: 'POST',
        headers: this.config.webhook!.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook请求失败: ${response.status} ${response.statusText}`);
      }

      console.log('Webhook通知发送成功');
    } catch (error) {
      console.error('发送webhook通知失败:', error);
    }
  }

  /**
   * 发送审核执行完成通知
   */
  async sendReviewExecutedNotification(reviewLog: ReviewLog): Promise<void> {
    try {
      console.log('发送审核执行完成通知:', reviewLog.id);

      const message = `审核结果已执行完成：${reviewLog.approved_count}个工具通过，${reviewLog.rejected_count}个工具被拒绝`;

      // 发送邮件通知
      if (this.config.email?.enabled) {
        await this.sendEmailExecutedNotification(reviewLog, message);
      }

      // 发送webhook通知
      if (this.config.webhook?.enabled) {
        await this.sendWebhookExecutedNotification(reviewLog, message);
      }

      console.log('审核执行完成通知发送成功');
    } catch (error) {
      console.error('发送审核执行完成通知失败:', error);
    }
  }

  /**
   * 发送审核执行完成的邮件通知
   */
  private async sendEmailExecutedNotification(reviewLog: ReviewLog, message: string): Promise<void> {
    const subject = `审核结果已执行 - ${reviewLog.approved_count}个工具已上线`;
    
    console.log('审核执行邮件通知已准备:', {
      subject,
      message,
      recipients: this.config.email?.recipients
    });
  }

  /**
   * 发送审核执行完成的webhook通知
   */
  private async sendWebhookExecutedNotification(reviewLog: ReviewLog, message: string): Promise<void> {
    try {
      const payload = {
        type: 'ai_review_executed',
        timestamp: new Date().toISOString(),
        data: {
          id: reviewLog.id,
          message: message,
          executed_at: new Date().toISOString(),
          approved_count: reviewLog.approved_count,
          rejected_count: reviewLog.rejected_count
        }
      };

      const response = await fetch(this.config.webhook!.url, {
        method: 'POST',
        headers: this.config.webhook!.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook请求失败: ${response.status} ${response.statusText}`);
      }

      console.log('审核执行Webhook通知发送成功');
    } catch (error) {
      console.error('发送审核执行webhook通知失败:', error);
    }
  }

  /**
   * 测试通知配置
   */
  async testNotifications(): Promise<boolean> {
    try {
      const testLog: ReviewLog = {
        id: 'test-id',
        review_date: new Date().toISOString().split('T')[0],
        total_tools: 5,
        approved_count: 3,
        rejected_count: 1,
        manual_review_count: 1,
        review_results: [],
        summary: '这是一个测试审核摘要',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      await this.sendReviewCompletedNotification(testLog);
      return true;
    } catch (error) {
      console.error('测试通知失败:', error);
      return false;
    }
  }

  /**
   * 获取通知配置状态
   */
  getConfigStatus(): { email: boolean; webhook: boolean } {
    return {
      email: this.config.email?.enabled || false,
      webhook: this.config.webhook?.enabled || false
    };
  }
}

export const notificationService = new NotificationService();
export type { NotificationConfig, ReviewLog };
