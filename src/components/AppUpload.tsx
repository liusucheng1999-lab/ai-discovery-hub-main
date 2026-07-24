import React, { useState } from 'react';
import {
  Upload, X, Github, Copy, Check, Lock, Globe, ChevronDown, ChevronUp,
  Sparkles, ShieldCheck, Zap, Download, Puzzle,
} from 'lucide-react';
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

type Mode = 'file' | 'codex' | 'github';

const CODEX_PUBLISH_PROMPT = '使用 AI 创客插件，把当前项目构建并发布为私密应用。';

/** 生成内联提示词（把多文件项目合并成单 HTML） */
const INLINE_PROMPT = `我有一个网页项目，包含多个文件（HTML + CSS + JS）。请帮我把它们合并成一个可以独立运行的单 HTML 文件：

1. 把所有 CSS 样式移入 <style> 标签（放在 <head> 内）
2. 把所有 JavaScript 代码移入 <script> 标签（放在 </body> 前）
3. 保持所有功能、样式完全不变
4. 确保合并后的文件可以直接在浏览器中双击打开运行

请把合并后的完整 HTML 代码输出给我，我会保存为 .html 文件上传。`;

export function AppUpload({ onSubmit, isLoading = false }: AppUploadProps) {
  const [mode, setMode] = useState<Mode>('file');

  // 文件模式
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // GitHub 模式
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrlError, setGithubUrlError] = useState('');
  const [copiedInline, setCopiedInline] = useState(false);
  const [copiedCodex, setCopiedCodex] = useState(false);
  const [showInlineTip, setShowInlineTip] = useState(false);

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

  const canSubmit = mode !== 'codex' && !!name.trim() && !githubUrlError && (
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
        <CardDescription>选择适合你的方式，把作品发布到 AI 创客</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── 模式切换 ──────────────────────────── */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl">
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
              onClick={() => setMode('codex')}
              className={`relative flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'codex'
                  ? 'bg-background shadow text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Codex 一键发布
              <span className="absolute -top-2 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold leading-none text-primary-foreground">
                推荐
              </span>
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

          {mode === 'codex' && (
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
              <div className="border-b border-primary/10 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">不用打包，不用 GitHub</h3>
                    <p className="text-xs text-muted-foreground">让 Codex 自动构建、上传并返回链接</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['1', '连接账号', '在 Codex 中连接你的 AI 创客账号'],
                    ['2', '发送指令', '告诉 Codex 发布当前项目'],
                    ['3', '获得链接', '自动完成构建、上传和验证'],
                  ].map(([step, title, text]) => (
                    <div key={step} className="rounded-xl border border-border/70 bg-background/80 p-3">
                      <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {step}
                      </div>
                      <p className="text-sm font-medium text-foreground">{title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-foreground">先下载 AI 创客发布工具</p>
                  <div>
                    <a
                      href="/downloads/ai-maker-codex-plugin.zip"
                      download
                      className="group flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Puzzle className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">下载完整 Codex 插件</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">包含 MCP、Skill 和运行依赖 · 约 5 MB</span>
                      </span>
                      <Download className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-y-0.5" />
                    </a>
                  </div>
                  <div className="mt-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                    下载完整插件后解压，把插件文件夹交给 Codex 并说“请安装这个本地插件”。安装完成后新建任务，再连接 AI 创客账号。
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  把这句话发给 Codex
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:flex-row sm:items-center">
                  <code className="flex-1 whitespace-normal text-sm text-foreground">{CODEX_PUBLISH_PROMPT}</code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(CODEX_PUBLISH_PROMPT);
                      setCopiedCodex(true);
                      setTimeout(() => setCopiedCodex(false), 2000);
                    }}
                  >
                    {copiedCodex ? <Check className="mr-1.5 h-4 w-4 text-green-500" /> : <Copy className="mr-1.5 h-4 w-4" />}
                    {copiedCodex ? '已复制' : '复制指令'}
                  </Button>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  首次使用时，Codex 会打开 AI 创客授权页。你确认后即可长期快捷发布，插件不会获取你的密码。
                </div>
              </div>
            </div>
          )}

          {mode !== 'codex' && (
            <>
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

          {/* ── 多文件提示（上传模式）─────────────── */}
          {mode === 'file' && (
            <div className="rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInlineTip((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <span>📁 有单独的 CSS / JS 文件？点此查看处理方法</span>
                {showInlineTip
                  ? <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                  : <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                }
              </button>
              {showInlineTip && (
                <div className="border-t border-border">
                  <p className="px-3 pt-3 pb-2 text-xs text-muted-foreground leading-relaxed">
                    本平台支持单个 <strong>.html</strong> 文件或打包好的 <strong>.zip</strong>。
                    如果你的项目有独立的 CSS / JS 文件，可以让 AI 帮你把它们内联合并成一个 HTML，
                    再上传。复制下方提示词，把你的代码一起发给 AI 即可：
                  </p>
                  <div className="mx-3 mb-3 rounded-lg border border-border bg-muted/40 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/60">
                      <span className="text-xs font-medium text-foreground">🤖 AI 内联提示词</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(INLINE_PROMPT);
                          setCopiedInline(true);
                          setTimeout(() => setCopiedInline(false), 2000);
                        }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedInline
                          ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500">已复制</span></>
                          : <><Copy className="w-3.5 h-3.5" />复制提示词</>
                        }
                      </button>
                    </div>
                    <p className="p-3 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap select-none">
                      {INLINE_PROMPT}
                    </p>
                  </div>
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

              <p className="text-xs text-muted-foreground">
                发布时会自动从 GitHub 拉取一次内容。应用创建成功后，会弹出包含应用 ID 的提示词，
                复制给 AI 配置 GitHub Actions 后，之后每次推送代码都会自动同步最新版本。
              </p>

              {/* 多文件提示 */}
              <div className="rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowInlineTip((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span>📁 仓库里有单独的 CSS / JS 文件？点此查看处理方法</span>
                  {showInlineTip
                    ? <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                    : <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                  }
                </button>
                {showInlineTip && (
                  <div className="border-t border-border">
                    <p className="px-3 pt-3 pb-2 text-xs text-muted-foreground leading-relaxed">
                      GitHub 同步只拉取你填写的那一个 <strong>.html</strong> 文件，不会拉取同目录下的 CSS / JS。
                      建议让 AI 把所有样式和脚本内联进 HTML，变成一个独立文件再同步。
                      复制下方提示词，把你的代码一起发给 AI 即可：
                    </p>
                    <div className="mx-3 mb-3 rounded-lg border border-border bg-muted/40 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/60">
                        <span className="text-xs font-medium text-foreground">🤖 AI 内联提示词</span>
                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(INLINE_PROMPT);
                            setCopiedInline(true);
                            setTimeout(() => setCopiedInline(false), 2000);
                          }}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedInline
                            ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500">已复制</span></>
                            : <><Copy className="w-3.5 h-3.5" />复制提示词</>
                          }
                        </button>
                      </div>
                      <p className="p-3 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap select-none">
                        {INLINE_PROMPT}
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
