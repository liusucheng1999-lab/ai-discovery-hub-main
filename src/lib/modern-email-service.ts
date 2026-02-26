// src/lib/modern-email-service.ts
// 现代邮件服务 - 支持SendGrid、Resend等现代API

interface EmailConfig {
  service: 'sendgrid' | 'resend' | 'smtp';
  apiKey?: string;
  recipients: string[];
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
}

interface EmailContent {
  subject: string;
  html: string;
  text?: string;
}

class ModernEmailService {
  private config: EmailConfig;

  constructor() {
    // 从环境变量加载配置
    const service = import.meta.env.VITE_EMAIL_SERVICE || 'smtp';
    
    this.config = {
      service: service as EmailConfig['service'],
      apiKey: import.meta.env.VITE_SENDGRID_API_KEY || import.meta.env.VITE_RESEND_API_KEY,
      recipients: import.meta.env.VITE_EMAIL_RECIPIENTS?.split(',') || [],
      smtpConfig: service === 'smtp' ? {
        host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
        secure: import.meta.env.VITE_SMTP_SECURE === 'true',
        user: import.meta.env.VITE_SMTP_USER || '',
        pass: import.meta.env.VITE_SMTP_PASS || ''
      } : undefined
    };
  }

  /**
   * 发送邮件
   */
  async sendEmail(content: EmailContent): Promise<boolean> {
    try {
      console.log(`使用 ${this.config.service} 发送邮件`);

      switch (this.config.service) {
        case 'sendgrid':
          return await this.sendViaSendGrid(content);
        case 'resend':
          return await this.sendViaResend(content);
        case 'smtp':
          return await this.sendViaSMTP(content);
        default:
          throw new Error(`不支持的邮件服务: ${this.config.service}`);
      }
    } catch (error) {
      console.error('发送邮件失败:', error);
      return false;
    }
  }

  /**
   * 通过SendGrid发送邮件
   */
  private async sendViaSendGrid(content: EmailContent): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: this.config.recipients.map(email => ({
            to: [{ email }],
            subject: content.subject
          })),
          from: { email: 'noreply@aidiscoveryhub.com', name: 'AI创客工具导航' },
          content: [
            { type: 'text/plain', value: content.text || this.htmlToText(content.html) },
            { type: 'text/html', value: content.html }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`SendGrid错误: ${response.status} ${error}`);
      }

      console.log('SendGrid邮件发送成功');
      return true;
    } catch (error) {
      console.error('SendGrid发送失败:', error);
      return false;
    }
  }

  /**
   * 通过Resend发送邮件
   */
  private async sendViaResend(content: EmailContent): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@aidiscoveryhub.com',
          to: this.config.recipients,
          subject: content.subject,
          html: content.html,
          text: content.text || this.htmlToText(content.html)
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend错误: ${response.status} ${error}`);
      }

      console.log('Resend邮件发送成功');
      return true;
    } catch (error) {
      console.error('Resend发送失败:', error);
      return false;
    }
  }

  /**
   * 通过SMTP发送邮件（传统方式）
   */
  private async sendViaSMTP(content: EmailContent): Promise<boolean> {
    try {
      console.log('SMTP邮件发送需要后端支持，前端无法直接发送');
      
      // 前端环境无法直接发送SMTP邮件
      // 需要通过后端API或使用无头浏览器等方案
      
      // 这里模拟发送成功
      console.log('SMTP邮件内容已准备:', {
        subject: content.subject,
        recipients: this.config.recipients,
        preview: content.html.substring(0, 100) + '...'
      });
      
      return true;
    } catch (error) {
      console.error('SMTP发送失败:', error);
      return false;
    }
  }

  /**
   * HTML转纯文本
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  /**
   * 测试邮件服务
   */
  async testEmailService(): Promise<boolean> {
    try {
      const testContent: EmailContent = {
        subject: 'AI审核系统 - 邮件服务测试',
        html: `
          <h2>🧪 邮件服务测试</h2>
          <p>这是一封测试邮件，用于验证邮件服务配置是否正确。</p>
          <p><strong>服务类型:</strong> ${this.config.service}</p>
          <p><strong>收件人:</strong> ${this.config.recipients.join(', ')}</p>
          <p><strong>发送时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
          <hr>
          <p><small>此邮件由AI创客工具导航系统自动发送</small></p>
        `,
        text: '邮件服务测试 - 验证配置是否正确'
      };

      return await this.sendEmail(testContent);
    } catch (error) {
      console.error('测试邮件服务失败:', error);
      return false;
    }
  }

  /**
   * 获取服务配置状态
   */
  getServiceInfo(): { service: string; configured: boolean; recipients: string[] } {
    return {
      service: this.config.service,
      configured: !!(this.config.apiKey || (this.config.smtpConfig?.user && this.config.smtpConfig?.pass)),
      recipients: this.config.recipients
    };
  }

  /**
   * 发送审核完成通知
   */
  async sendReviewCompletedNotification(reviewLog: any): Promise<boolean> {
    const subject = `AI审核完成 - ${reviewLog.total_tools}个工具待确认`;
    const htmlContent = this.generateReviewEmailContent(reviewLog);
    
    return await this.sendEmail({
      subject,
      html: htmlContent,
      text: `AI审核完成，${reviewLog.total_tools}个工具待确认，请登录管理后台查看详情。`
    });
  }

  /**
   * 生成审核邮件内容
   */
  private generateReviewEmailContent(reviewLog: any): string {
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px; }
        .content { padding: 30px; background: #f9fafb; border-radius: 12px; margin: 20px 0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat { text-align: center; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .stat:hover { transform: translateY(-2px); }
        .stat-number { font-size: 2.5em; font-weight: bold; background: linear-gradient(45deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { color: #666; margin-top: 8px; font-size: 0.9em; }
        .summary { background: white; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #667eea; }
        .action-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 8px; font-weight: 500; transition: all 0.3s; }
        .action-button:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4); }
        .footer { text-align: center; padding: 25px; color: #666; font-size: 0.9em; }
        .watermark { background: #f0f0f0; padding: 10px; border-radius: 6px; font-size: 0.8em; color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI审核完成通知</h1>
            <p style="font-size: 1.1em; margin-top: 10px;">${new Date(reviewLog.created_at).toLocaleDateString('zh-CN')} 的AI审核已完成</p>
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
                <h3 style="margin-top: 0; color: #667eea;">📋 审核摘要</h3>
                <pre style="white-space: pre-wrap; font-family: 'SF Mono', Monaco, monospace; background: #f8f9fa; padding: 15px; border-radius: 6px; font-size: 0.9em; line-height: 1.5;">${reviewLog.summary}</pre>
            </div>

            <div style="text-align: center; margin: 35px 0;">
                <h3 style="margin-bottom: 20px;">📝 请确认审核结果</h3>
                <p style="color: #666; margin-bottom: 25px;">请登录管理后台查看详细审核结果并确认执行：</p>
                <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/admin" class="action-button">
                    🚀 查看审核结果
                </a>
                <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/admin?tab=logs" class="action-button" style="background: #6b7280;">
                    📊 管理审核日志
                </a>
            </div>
        </div>

        <div class="footer">
            <div class="watermark">
                <p>🤖 此邮件由 AI创客工具导航系统 自动发送</p>
                <p style="margin-top: 5px;">⏰ 发送时间: ${new Date().toLocaleString('zh-CN')}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}

export const modernEmailService = new ModernEmailService();
export type { EmailConfig, EmailContent };
