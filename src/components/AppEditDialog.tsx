import React, { useState, useEffect } from 'react';
import { Upload, X, Github, Copy, Check, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { appService, isValidGithubHtmlUrl } from '@/lib/appService';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

interface AppEditDialogProps {
  app: HostedApp | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: HostedApp) => void;
}

/** 生成用户需要放进自己 GitHub 仓库的 Actions YAML */
function buildActionsYaml(appId: string) {
  return `name: 同步到 AI创客社区
on:
  push:
    branches: [main]   # 改成你的主分支名

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: 触发同步
        run: |
          curl -s -X POST "https://aimakerbox.com/api/sync-app?app_id=${appId}"
`;
}

/** 格式化同步时间 */
function formatSyncTime(t: string | null) {
  if (!t) return null;
  const diff = Date.now() - new Date(t).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

export function AppEditDialog({ app, open, onClose, onSaved }: AppEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [appFile, setAppFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrlError, setGithubUrlError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedApp, setSavedApp] = useState<HostedApp | null>(null);

  useEffect(() => {
    if (app) {
      setName(app.name);
      setDescription(app.description || '');
      setCoverPreview(app.cover_image_url || null);
      setCoverImage(null);
      setAppFile(null);
      setGithubUrl(app.github_url || '');
      setGithubUrlError('');
      setSavedApp(app);
    }
  }, [app]);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      setCoverImage(img);
      setCoverPreview(URL.createObjectURL(img));
    }
  };

  const handleAppFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAppFile(f);
  };

  const handleGithubUrlChange = (val: string) => {
    setGithubUrl(val);
    if (val && !isValidGithubHtmlUrl(val)) {
      setGithubUrlError('请粘贴 GitHub 上 .html 文件的链接，例如 https://github.com/你/仓库/blob/main/index.html');
    } else {
      setGithubUrlError('');
    }
  };

  const handleCopyYaml = async () => {
    if (!savedApp) return;
    await navigator.clipboard.writeText(buildActionsYaml(savedApp.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /** 立即触发一次同步（测试用） */
  const handleManualSync = async () => {
    if (!savedApp) return;
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/sync-app?app_id=${savedApp.id}`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '同步失败');
      toast.success('同步成功！应用已更新为 GitHub 最新内容');
      // 更新本地同步时间
      setSavedApp((prev) => prev ? { ...prev, github_synced_at: new Date().toISOString() } : prev);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '同步失败，请稍后重试');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    if (!app) return;
    if (!name.trim()) { toast.error('应用名称不能为空'); return; }
    if (githubUrl && !isValidGithubHtmlUrl(githubUrl)) { toast.error('GitHub 链接格式不正确'); return; }

    try {
      setIsSaving(true);

      if (appFile) await appService.updateAppFile(app.id, appFile);

      let coverUrl: string | null | undefined = undefined;
      if (coverImage) coverUrl = await appService.uploadCoverImage(app.id, coverImage);

      const newGithubUrl = githubUrl.trim() || null;
      const githubChanged = newGithubUrl !== (app.github_url || null);

      let updated = await appService.updateApp(app.id, {
        name: name.trim(),
        description: description.trim(),
        ...(coverUrl !== undefined ? { cover_image_url: coverUrl } : {}),
      });

      if (githubChanged) {
        updated = await appService.updateGithubUrl(app.id, newGithubUrl);
      }

      setSavedApp(updated);
      toast.success('应用已更新');
      onSaved(updated);
      // 不关闭弹窗，让用户看到 GitHub Actions 配置说明
      if (newGithubUrl && githubChanged) {
        // 保持弹窗开着，让用户能复制 YAML
      } else {
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '更新失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 只要输入框里有合法 URL 就显示 YAML（不必等保存）
  const currentGithubUrl = (!githubUrlError && githubUrl.trim()) ? githubUrl.trim() : (savedApp?.github_url || null);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑应用</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              应用名称 <span className="text-destructive">*</span>
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="应用名称" />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">应用描述</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单介绍你的应用功能"
              rows={3}
            />
          </div>

          {/* 应用文件 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              应用文件（可选更换）
            </label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm"
                onClick={() => document.getElementById('edit-appfile-input')?.click()}>
                <Upload className="w-4 h-4 mr-1" />选择新文件
              </Button>
              <span className="text-sm text-muted-foreground truncate">
                {appFile ? appFile.name : '不更换则保留原文件'}
              </span>
              {appFile && (
                <button type="button" onClick={() => setAppFile(null)}
                  className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input type="file" onChange={handleAppFileSelect} accept=".html,.zip"
              className="hidden" id="edit-appfile-input" />
          </div>

          {/* GitHub 自动同步 */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <label className="block text-sm font-medium text-foreground">
              <Github className="inline w-4 h-4 mr-1.5 -mt-0.5" />
              GitHub 自动同步
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">可选</span>
            </label>

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
            {githubUrlError && (
              <p className="text-xs text-destructive">{githubUrlError}</p>
            )}

            {/* 已配置 GitHub：显示 Actions YAML + 同步状态 */}
            {currentGithubUrl && !githubUrlError && (
              <div className="space-y-3 pt-1">
                {/* 同步状态 */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${savedApp?.github_synced_at ? 'bg-green-500' : 'bg-yellow-400'}`} />
                    {savedApp?.github_synced_at
                      ? `上次同步：${formatSyncTime(savedApp.github_synced_at)}`
                      : '尚未同步'}
                  </p>
                  <Button size="sm" variant="outline" onClick={handleManualSync}
                    disabled={isSyncing} className="h-7 text-xs px-2.5">
                    <RefreshCw className={`w-3 h-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                    立即同步
                  </Button>
                </div>

                {/* GitHub Actions 配置说明 */}
                <div className="rounded-lg bg-gray-950 dark:bg-black border border-gray-800 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                    <span className="text-xs text-gray-400 font-mono">
                      .github/workflows/sync-to-aimakerbox.yml
                    </span>
                    <button
                      onClick={handleCopyYaml}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {copied
                        ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">已复制</span></>
                        : <><Copy className="w-3.5 h-3.5" />复制</>
                      }
                    </button>
                  </div>
                  <pre className="p-3 text-xs text-gray-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    {savedApp ? buildActionsYaml(savedApp.id) : ''}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  把上面的文件放入你的 GitHub 仓库，每次 push 后应用会自动更新。
                  {!savedApp?.github_url && (
                    <span className="text-amber-500 ml-1">（请先点保存，再配置 GitHub 仓库）</span>
                  )}
                </p>
              </div>
            )}

            {!currentGithubUrl && (
              <p className="text-xs text-muted-foreground">
                填入 GitHub 文件链接并保存后，会生成自动同步的配置代码。
              </p>
            )}
          </div>

          {/* 封面图 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">展示图（封面）</label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img src={coverPreview} alt="封面预览"
                  className="w-full max-w-xs aspect-video object-cover rounded-lg border" />
                <button type="button"
                  onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-5 text-center bg-muted/20">
                <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <Button type="button" variant="outline" size="sm"
                  onClick={() => document.getElementById('edit-cover-input')?.click()}>
                  选择图片
                </Button>
              </div>
            )}
            <input type="file" onChange={handleCoverSelect} accept="image/*"
              className="hidden" id="edit-cover-input" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>关闭</Button>
          <Button onClick={handleSave} disabled={isSaving || !!githubUrlError}>
            {isSaving ? '保存中…' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
