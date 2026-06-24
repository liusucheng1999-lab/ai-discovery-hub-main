import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
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
import { appService } from '@/lib/appService';
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
  const [isSaving, setIsSaving] = useState(false);

  // 当打开的应用变化时，初始化表单
  useEffect(() => {
    if (app) {
      setName(app.name);
      setDescription(app.description || '');
      setCoverPreview(app.cover_image_url || null);
      setCoverImage(null);
    }
  }, [app]);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      setCoverImage(img);
      setCoverPreview(URL.createObjectURL(img));
    }
  };

  const handleSave = async () => {
    if (!app) return;
    if (!name.trim()) {
      toast.error('应用名称不能为空');
      return;
    }

    try {
      setIsSaving(true);

      // 如果换了新封面图，先上传
      let coverUrl: string | null | undefined = undefined;
      if (coverImage) {
        coverUrl = await appService.uploadCoverImage(app.id, coverImage);
      }

      const updated = await appService.updateApp(app.id, {
        name: name.trim(),
        description: description.trim(),
        ...(coverUrl !== undefined ? { cover_image_url: coverUrl } : {}),
      });

      toast.success('应用已更新');
      onSaved(updated);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : '更新失败');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
