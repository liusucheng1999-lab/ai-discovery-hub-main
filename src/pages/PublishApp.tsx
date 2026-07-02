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

      if (data.isPrivate) {
        toast.success('私密应用已创建，可通过链接分享访问');
      } else {
        toast.success('已提交，等待管理员审核通过后即可展示');
      }
      navigate('/my-apps');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : '发布应用失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

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
