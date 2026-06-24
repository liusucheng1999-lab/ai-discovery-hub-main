import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppUpload } from '@/components/AppUpload';
import { Button } from '@/components/ui/button';
import { appService } from '@/lib/appService';
import { toast } from 'sonner';

export function PublishApp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    file: File;
    coverImage?: File;
  }) => {
    try {
      setIsLoading(true);
      const result = await appService.uploadApp({
        name: data.name,
        description: data.description,
        file: data.file,
        coverImage: data.coverImage,
      });

      toast.success('应用发布成功！');
      navigate(`/run/${result.app_id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : '发布应用失败，请重试'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/published-apps">
            <Button variant="outline">← 返回项目展示</Button>
          </Link>
        </div>
        <AppUpload onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
