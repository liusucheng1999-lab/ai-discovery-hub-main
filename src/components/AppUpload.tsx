import React, { useState } from 'react';
import { Upload, X, Github, Copy, Check, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidGithubHtmlUrl } from '@/lib/appService';

interface AppUploadProps {
  onSubmit: (data: {
    name: string;
    description: string;
    file?: File;
    coverImage?: File;
    githubUrl?: string;
    isPrivate?: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

type Mode = 'file' | 'github';

/** 从 GitHub 文件 URL 中提取仓库地址 */
function extractRepoUrl(url: string): string {
  const m = url.match(/https:\/\/github\.com\/([^/]+\/[^/]+)/);
  return m ? `https://github.com/${m[1]}` : '你的 GitHub 仓库';
}

/** 生成 AI 提示词 */
function buildAiPrompt(githubUrl: string, appId?: string) {
  const repoUrl = extractRepoUrl(githubUrl);
  const syncUrl = appId
    ? `https://aimakerbox.com/api/sync-app?app_id=${appId}`
    : 'https://aimakerbox.com/api/sync-app?app_id=（发布后获取）';

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

export function AppUpload({ onSubmit, isLoading = false }: AppUploadProps) {
  const [mode, setMode] = useState<Mode>('file');

  // 文件模式
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // GitHub 模式
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrlError, setGithubUrlError] = useState('');
  const [copied, setCopied] = useState(false);

  // 通用
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) { setCoverImage(img); setCoverPreview(URL.createObjectURL(img)); }
  };

  const removeCover = () => {
    setCoverImage(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleGithubUrlChange = (val: string) => {
    setGithubUrl(val);
    if (val && !isValidGithubHtmlUrl(val)) {
      setGithubUrlError('请粘贴 GitHub 上 .html 文件的链接，例如 https://github.com/你/仓库/blob/main/index.html');
    } else {
      setGithubUrlError('');
    }
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(buildAiPrompt(githubUrl));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canSubmit = !!name.trim() && !githubUrlError && (
    mode === 'file' ? !!file : !!githubUrl.trim()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      file: mode === 'file' ? (file ?? undefined) : undefined,
      coverImage: coverImage || undefined,
      githubUrl: mode === 'github' ? githubUrl.trim() : undefined,
      isPrivate,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>发布应用</CardTitle>
        <CardDescription>上传 HTML 文件，或连接 GitHub 仓库自动同步</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── 模式切换 ──────────────────────────── */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'file'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload className="w-4 h-4" />
              上传文件
            </button>
            <button
              type="button"
              onClick={() => setMode('github')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'github'
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Github className="w-4 h-4" />
              连接 GitHub
            </button>
          </div>

          {/* ── 上传文件模式 ──────────────────────── */}
          {mode === 'file' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/20 hover:border-muted-foreground/40'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)}
                    className="p-1.5 hover:bg-muted rounded-md">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-1">拖拽文件或点击选择</p>
                  <p className="text-sm text-muted-foreground mb-4">支持 .html 或 .zip 文件</p>
                  <input type="file" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                    accept=".html,.zip" className="hidden" id="file-input" />
                  <Button type="button" variant="outline"
                    onClick={() => document.getElementById('file-input')?.click()}>
                    选择文件
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── GitHub 模式 ───────────────────────── */}
          {mode === 'github' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  GitHub 文件链接 <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  在 GitHub 仓库里打开你的 HTML 文件，复制浏览器地址栏的链接粘贴到这里。
                </p>
                <div className="relative">
                  <Input
                    value={githubUrl}
                    onChange={(e) => handleGithubUrlChange(e.target.value)}
                    placeholder="https://github.com/你/仓库/blob/main/index.html"
                    className={githubUrlError ? 'border-destructive' : ''}
                  />
                  {githubUrl && (
                    <button type="button"
                      onClick={() => { setGithubUrl(''); setGithubUrlError(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {githubUrlError && <p className="text-xs text-destructive mt-1.5">{githubUrlError}</p>}
              </div>

              {/* AI 提示词（链接合法时显示） */}
              {githubUrl && !githubUrlError && (
                <div className="rounded-lg border border-border bg-muted/40 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/60">
                    <span className="text-xs font-medium text-foreground">
                      🤖 发布后，把下方提示词发给 AI，让它帮你配置自动同步
                    </span>
                    <button type="button" onClick={handleCopyPrompt}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {copied
                        ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500">已复制</span></>
                        : <><Copy className="w-3.5 h-3.5" />复制提示词</>
                      }
                    </button>
                  </div>
                  <p className="p-3 text-xs text-muted-foreground leading-relaxed line-clamp-4 select-none">
                    {buildAiPrompt(githubUrl)}
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                发布时会自动从 GitHub 拉取一次内容。之后每次你推送代码，
                用上方提示词让 AI 配置好 GitHub Actions，网站就会自动同步最新版本。
              </p>
            </div>
          )}

          {/* ── 应用名称 ──────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              应用名称 <span className="text-destructive">*</span>
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="例如：我的 AI 小工具" required />
          </div>

          {/* ── 应用描述 ──────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">应用描述</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="简单介绍你的应用功能、适合哪些场景…" rows={3} />
          </div>

          {/* ── 可见性 ──────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">可见性</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                  !isPrivate
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-muted-foreground/50'
                }`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium leading-tight">公开展示</p>
                  <p className="text-xs opacity-70 mt-0.5">审核通过后显示在社区</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                  isPrivate
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-muted-foreground/50'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium leading-tight">私密链接</p>
                  <p className="text-xs opacity-70 mt-0.5">仅通过链接访问，无需审核</p>
                </div>
              </button>
            </div>
          </div>

          {/* ── 封面图 ──────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              展示图（封面）
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">可选</span>
            </label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img src={coverPreview} alt="封面预览"
                  className="w-full max-w-sm aspect-video object-cover rounded-lg border border-border" />
                <button type="button" onClick={removeCover}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20 hover:border-muted-foreground/40 transition-colors">
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">上传封面图，会显示在社区卡片上</p>
                <input type="file" onChange={handleCoverSelect} accept="image/*"
                  className="hidden" id="cover-input" />
                <Button type="button" variant="outline" size="sm"
                  onClick={() => document.getElementById('cover-input')?.click()}>
                  选择图片
                </Button>
              </div>
            )}
          </div>

          {/* ── 提交 ──────────────────────────────── */}
          <Button type="submit" disabled={!canSubmit || isLoading} className="w-full">
            {isLoading ? '提交中…' : '提交审核'}
          </Button>
          <p className="text-xs text-center text-muted-foreground -mt-3">
            提交后需管理员审核通过，才会在产品社区展示
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
