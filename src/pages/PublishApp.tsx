import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppUpload } from '@/components/AppUpload';
import { Button } from '@/components/ui/button';
import { appService } from '@/lib/appService';
import { toast } from 'sonner';
import { Copy, Check, ArrowRight } from 'lucide-react';

function extractRepoUrl(url: string): string {
  const m = url.match(/https:\/\/github\.com\/([^/]+\/[^/]+)/);
  return m ? `https://github.com/${m[1]}` : '你的 GitHub 仓库';
}

function buildAiPrompt(githubUrl: string, appId: string) {
  const repoUrl = extractRepoUrl(githubUrl);
  const syncUrl = `https://aimakerbox.com/api/sync-app?app_id=${appId}`;
  return `请帮我在 GitHub 仓库 ${repoUrl} 中创建一个 GitHub Actions workflow 文件，实现每次推送代码后自动同步到 AI创客社区网站。

请创建以下文件：
文件路径：.github/workflows/sync-to-aimakerbox.yml
文件内容：
\`\`\`yaml
name: 同步到 AI创客社区
on:
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: 触发同步
        run: |
          curl -s -X POST "${syncUrl}"
\`\`\`

操作步骤：
1. 在仓库根目录创建 .github/workflows/ 文件夹（如果不存在）
2. 创建 sync-to-aimakerbox.yml 文件，填入上面的内容
3. 提交并推送到主分支（main 或 master）

完成后，每次我向这个仓库推送代码，网站上的应用就会自动更新为最新内容。`;
}

export function PublishApp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successState, setSuccessState] = useState<{
    appId: string;
    githubUrl: string;
    isPrivate: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    file?: File;
    coverImage?: File;
    githubUrl?: string;
    isPrivate?: boolean;
  }) => {
    try {
      setIsLoading(true);
      const result = await appService.uploadApp({
        name: data.name,
        description: data.description,
        file: data.file,
        coverImage: data.coverImage,
        githubUrl: data.githubUrl,
        isPrivate: data.isPrivate,
      });

      // GitHub 模式：发布成功后显示含真实 app_id 的提示词
      if (data.githubUrl) {
        setSuccessState({
          appId: result.app_id,
          githubUrl: data.githubUrl,
          isPrivate: data.isPrivate ?? false,
        });
      } else {
        if (data.isPrivate) {
          toast.success('私密应用已创建，可通过链接分享访问');
        } else {
          toast.success('已提交，等待管理员审核通过后即可展示');
        }
        navigate('/my-apps');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : '发布应用失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!successState) return;
    await navigator.clipboard.writeText(buildAiPrompt(successState.githubUrl, successState.appId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 发布成功 + GitHub 模式：显示提示词面板
  if (successState) {
    const prompt = buildAiPrompt(successState.githubUrl, successState.appId);
    return (
      <div className="pt-20 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 成功提示 */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-green-800 font-semibold text-base mb-1">✅ 应用发布成功！</p>
            <p className="text-green-700 text-sm">
              {successState.isPrivate
                ? '私密应用已创建，可通过链接分享访问。'
                : '已提交，等待管理员审核通过后即可展示。'}
            </p>
          </div>

          {/* AI 提示词面板 */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/60 border-b border-border">
              <span className="text-sm font-medium">
                🤖 把下方提示词发给 AI，让它帮你配置自动同步
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied
                  ? <><Check className="w-4 h-4 text-green-500" /><span className="text-green-500">已复制</span></>
                  : <><Copy className="w-4 h-4" />复制提示词</>
                }
              </button>
            </div>
            <pre className="p-4 text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap break-all bg-muted/20 max-h-64 overflow-auto">
              {prompt}
            </pre>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            提示词里已包含你的应用 ID，复制后发给任意 AI 即可完成配置。
          </p>

          {/* 跳转按钮 */}
          <Button className="w-full" onClick={() => navigate('/my-apps')}>
            前往我的应用
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/">
            <Button variant="outline">← 返回产品社区</Button>
          </Link>
        </div>
        <AppUpload onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
