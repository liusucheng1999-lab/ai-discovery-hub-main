import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AppUploadProps {
  onSubmit: (data: { name: string; description: string; file: File }) => Promise<void>;
  isLoading?: boolean;
}

export function AppUpload({ onSubmit, isLoading = false }: AppUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      alert('Please fill in all required fields');
      return;
    }
    await onSubmit({ name, description, file });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>发布应用</CardTitle>
        <CardDescription>上传你的 HTML 应用或 ZIP 文件包</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-700 font-medium">
                  拖拽文件或点击选择
                </p>
                <p className="text-sm text-gray-500">
                  支持 .html 或 .zip 文件
                </p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".html,.zip"
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('file-input')?.click();
                    }}
                  >
                    选择文件
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* App Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              应用名称 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：我的 Todo 应用"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              应用描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单介绍你的应用功能"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!file || !name || isLoading}
            className="w-full"
          >
            {isLoading ? '上传中...' : '发布应用'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
