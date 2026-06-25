import React, { useState } from 'react';
import { Upload, X, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidGithubHtmlUrl } from '@/lib/appService';

interface AppUploadProps {
  onSubmit: (data: {
    name: string;
    description: string;
    file: File;
    coverImage?: File;
    githubUrl?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AppUpload({ onSubmit, isLoading = false }: AppUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubUrlError, setGithubUrlError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      setCoverImage(img);
      setCoverPreview(URL.createObjectURL(img));
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleGithubUrlChange = (val: string) => {
    setGithubUrl(val);
    if (val && !isValidGithubHtmlUrl(val)) {
      setGithubUrlError('请粘贴 GitHub 上 .html 文件的链接，例如 https://github.com/你/仓库/blob/main/index.html');
    } else {
      setGithubUrlError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) {
      alert('请填写应用名称并选择文件');
      return;
    }
    if (githubUrl && !isValidGithubHtmlUrl(githubUrl)) {
      alert('GitHub 链接格式不正确');
      return;
    }
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      file,
      coverImage: coverImage || undefined,
      githubUrl: githubUrl.trim() || undefined,
    });
  };

  const canSubmit = !!file && !!name.trim() && !githubUrlError;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>发布应用</CardTitle>
        <CardDescription>上传你的 HTML 应用或 ZIP 文件包</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── 文件上传区 ──────────────────────────── */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30 hover:border-muted-foreground/40'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 hover:bg-muted rounded-md"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-foreground font-medium mb-1">拖拽文件或点击选择</p>
                <p className="text-sm text-muted-foreground mb-4">支持 .html 或 .zip 文件</p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".html,.zip"
                  className="hidden"
                  id="file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  选择文件
                </Button>
              </div>
            )}
          </div>

          {/* ── 应用名称 ──────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              应用名称 <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：我的 AI 小工具"
              required
            />
          </div>

          {/* ── 应用描述 ──────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              应用描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单介绍你的应用功能、适合哪些场景…"
              rows={3}
            />
          </div>

          {/* ── GitHub 自动同步（可选）──────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              <Github className="inline w-4 h-4 mr-1 -mt-0.5" />
              GitHub 自动同步
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">可选</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              绑定 GitHub 中的 HTML 文件后，每次你推送到 GitHub，网站会自动同步最新内容。
              国内用户无需翻墙，同步由服务器在境外完成。
            </p>
            <div className="relative">
              <Input
                value={githubUrl}
                onChange={(e) => handleGithubUrlChange(e.target.value)}
                placeholder="https://github.com/你/仓库/blob/main/index.html"
                className={githubUrlError ? 'border-destructive' : ''}
              />
              {githubUrl && (
                <button
                  type="button"
                  onClick={() => { setGithubUrl(''); setGithubUrlError(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {githubUrlError && (
              <p className="text-xs text-destructive mt-1.5">{githubUrlError}</p>
            )}
          </div>

          {/* ── 封面图 ──────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              展示图（封面）
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">可选</span>
            </label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img
                  src={coverPreview}
                  alt="封面预览"
                  className="w-full max-w-sm aspect-video object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20 hover:border-muted-foreground/40 transition-colors">
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  上传封面图，会显示在社区卡片上
                </p>
                <input
                  type="file"
                  onChange={handleCoverSelect}
                  accept="image/*"
                  className="hidden"
                  id="cover-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('cover-input')?.click()}
                >
                  选择图片
                </Button>
              </div>
            )}
          </div>

          {/* ── 提交 ──────────────────────────────── */}
          <Button type="submit" disabled={!canSubmit || isLoading} className="w-full">
            {isLoading ? '上传中…' : '提交审核'}
          </Button>
          <p className="text-xs text-center text-muted-foreground -mt-3">
            提交后需管理员审核通过，才会在产品社区展示
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
