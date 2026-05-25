import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { appService } from '@/lib/appService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

export function AppDetail() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<HostedApp | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApp = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const appData = await appService.getApp(id);
        setApp(appData);

        // Get the signed URL for the app file
        const url = await appService.getAppFileUrl(appData.app_file_path);
        setAppUrl(url);

        // Increment view count
        await appService.incrementViewCount(id);
      } catch (err) {
        console.error('Error loading app:', err);
        setError(
          err instanceof Error ? err.message : '加载应用失败'
        );
        toast.error('应用加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadApp();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error || '应用不存在'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* App Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {app.name}
          </h1>
          {app.description && (
            <p className="text-lg text-gray-600">{app.description}</p>
          )}
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>浏览: {app.view_count}</span>
            <span>运行: {app.run_count}</span>
          </div>
        </div>

        {/* App Display */}
        <Card>
          <CardHeader>
            <CardTitle>应用预览</CardTitle>
          </CardHeader>
          <CardContent>
            {appUrl ? (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={appUrl}
                  title={app.name}
                  className="w-full border-0"
                  style={{ height: '600px' }}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                应用加载中...
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>应用信息</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-700">发布时间</dt>
                <dd className="mt-1 text-sm text-gray-600">
                  {new Date(app.created_at).toLocaleString('zh-CN')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-700">最后更新</dt>
                <dd className="mt-1 text-sm text-gray-600">
                  {new Date(app.updated_at).toLocaleString('zh-CN')}
                </dd>
              </div>
              {!app.is_published && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  这是一个未发布的应用，仅你可以访问
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
