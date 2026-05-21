import React, { useEffect, useState } from 'react';
import { appService } from '@/lib/appService';
import { AppCard } from '@/components/AppCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

export function PublishedApps() {
  const [apps, setApps] = useState<HostedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setIsLoading(true);
        const data = await appService.getPublishedApps();
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">应用库</h1>
          <p className="text-gray-600">发现和使用社区创作的应用</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">还没有发布的应用</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
