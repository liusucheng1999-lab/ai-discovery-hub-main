import React, { useState, useEffect } from 'react';
import { Upload, X, Github } from 'lucide-react';
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

export function AppEditDialog({ app, open, onClose, onSaved }: AppEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [appFile, setAppFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrlError, setGithubUrlError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 当打开的应用变化时，初始化表单
  useEffect(() => {
    if (app) {
      setName(app.name);
      setDescription(app.description || '');
      setCoverPreview(app.cover_image_url || null);
      setCoverImage(null);
      setAppFile(null);
      setGithubUrl(app.github_url || '');
      setGithubUrlError('');
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

  const handleSave = async () => {
    if (!app) return;
    if (!name.trim()) {
      toast.error('应用名称不能为空');
      return;
    }
    if (githubUrl && !isValidGithubHtmlUrl(githubUrl)) {
      toast.error('GitHub 链接格式不正确');
      return;
    }

    try {
      setIsSaving(true);

      // 如果换了应用文件，先更新文件（此时会清空 GitHub 同步关联）
      if (appFile) {
        await appService.updateAppFile(app.id, appFile);
      }

      // 如果换了新封面图，先上传
      let coverUrl: string | null | undefined = undefined;
      if (coverImage) {
        coverUrl = await appService.uploadCoverImage(app.id, coverImage);
      }

      // GitHub URL 是否有变化
      const newGithubUrl = githubUrl.trim() || null;
      const githubChanged = newGithubUrl !== (app.github_url || null);

      // 同时更新基本信息
      let updated = await appService.updateApp(app.id, {
        name: name.trim(),
        description: description.trim(),
        ...(coverUrl !== undefined ? { cover_image_url: coverUrl } : {}),
      });

      // 如果 GitHub URL 有变化，单独更新（会重置 github_synced_at）
      if (githubChanged) {
        updated = await appService.updateGithubUrl(app.id, newGithubUrl);
        if (newGithubUrl) {
          toast.success('应用已更新，GitHub 同步将在下次定时任务时自动执行');
        } else {
          toast.success('应用已更新，已移除 GitHub 同步');
        }
      } else {
        toast.success('应用已更新');
      }

      onSaved(updated);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : '更新失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 格式化上次同步时间
  const formatSyncTime = (t: string | null) => {
    if (!t) return null;
    const diff = Date.now() - new Date(t).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins} 分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小时前`;
    return `${Math.floor(hours / 24)} 天前`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑应用</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              应用名称 <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="应用名称"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              应用描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单介绍你的应用功能"
              rows={3}
            />
          </div>

          {/* 应用文件 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              应用文件（可选更换）
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('edit-appfile-input')?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                选择新文件
              </Button>
              <span className="text-sm text-gray-500 truncate">
                {appFile ? appFile.name : '不更换则保留原文件'}
              </span>
              {appFile && (
                <button
                  type="button"
                  onClick={() => setAppFile(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="file"
              onChange={handleAppFileSelect}
              accept=".html,.zip"
              className="hidden"
              id="edit-appfile-input"
            />
          </div>

          {/* GitHub 自动同步 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Github className="inline w-4 h-4 mr-1 -mt-0.5" />
              GitHub 自动同步（可选）
            </label>
            <p className="text-xs text-gray-400 mb-2">
              粘贴 GitHub 上 HTML 文件的链接，服务器将每小时自动同步最新内容。
              国内用户无需翻墙，同步由服务器在境外执行。
            </p>
            <div className="relative">
              <Input
                value={githubUrl}
                onChange={(e) => handleGithubUrlChange(e.target.value)}
                placeholder="https://github.com/你/仓库/blob/main/index.html"
                className={githubUrlError ? 'border-red-400 pr-8' : 'pr-8'}
              />
              {githubUrl && (
                <button
                  type="button"
                  onClick={() => { setGithubUrl(''); setGithubUrlError(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            {githubUrlError && (
              <p className="text-xs text-red-500 mt-1">{githubUrlError}</p>
            )}
            {/* 当前同步状态 */}
            {app?.github_url && !githubUrlError && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                {app.github_synced_at ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                    上次同步：{formatSyncTime(app.github_synced_at)}
                  </>
                ) : (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    尚未同步，等待下次定时任务（每小时一次）
                  </>
                )}
              </div>
            )}
          </div>

          {/* 封面图 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              展示图（封面）
            </label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img
                  src={coverPreview}
                  alt="封面预览"
                  className="w-full max-w-xs aspect-video object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage(null);
                    setCoverPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center bg-gray-50">
                <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('edit-cover-input')?.click()}
                >
                  选择图片
                </Button>
              </div>
            )}
            <input
              type="file"
              onChange={handleCoverSelect}
              accept="image/*"
              className="hidden"
              id="edit-cover-input"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !!githubUrlError}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
