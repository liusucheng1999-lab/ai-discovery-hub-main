import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appService } from '@/lib/appService';
import { AppCard } from '@/components/AppCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

export function AppManagement() {
  const [apps, setApps] = useState<HostedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<HostedApp | null>(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setIsLoading(true);
        const data = await appService.getUserApps();
        setApps(data);
      } catch (error) {
        console.error('Error loading apps:', error);
        toast.error('加载应用列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, []);

  const handleDelete = async (appId: string) => {
    try {
      await appService.deleteApp(appId);
      setApps(apps.filter((app) => app.id !== appId));
      toast.success('应用已删除');
    } catch (error) {
      console.error('Error deleting app:', error);
      toast.error('删除应用失败');
    }
  };

  const handlePublish = async (app: HostedApp) => {
    try {
      const updated = await appService.publishApp(app.id, !app.is_published);
      setApps(apps.map((a) => (a.id === app.id ? updated : a)));
      toast.success(
        updated.is_published ? '应用已发布' : '应用已取消发布'
      );
    } catch (error) {
      console.error('Error updating app:', error);
      toast.error('更新应用失败');
    }
  };

  return (
    <div className="pt-20 container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">我的应用</h1>
            <p className="text-gray-600">管理你发布的所有应用</p>
          </div>
          <div className="flex gap-2">
            <Link to="/published-apps">
              <Button variant="outline">🏠 项目展示</Button>
            </Link>
            <Link to="/publish">
              <Button>➕ 发布新应用</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">你还没有发布任何应用</p>
            <Link to="/publish">
              <Button>发布你的第一个应用</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div key={app.id} className="relative">
                <AppCard
                  app={app}
                  showActions={true}
                  onEdit={() => setEditingApp(app)}
                  onDelete={handleDelete}
                />
                <div className="mt-2 flex gap-2">
                  <Button
                    variant={app.is_published ? 'destructive' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => handlePublish(app)}
                  >
                    {app.is_published ? '取消发布' : '发布'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
