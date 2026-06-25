import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Zap, Users } from 'lucide-react';
import { appService } from '@/lib/appService';
import { AppCard } from '@/components/AppCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

/** 骨架屏卡片 */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-muted rounded-lg w-3/5" />
        <div className="h-3 bg-muted rounded-lg w-full" />
        <div className="h-3 bg-muted rounded-lg w-4/5" />
        <div className="h-3 bg-muted rounded-lg w-1/3 mt-4" />
      </div>
    </div>
  );
}

export function PublishedApps() {
  const { isLoggedIn } = useAuth();
  const [apps, setApps] = useState<HostedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await appService.getPublishedApps();
        setApps(data);
      } catch {
        toast.error('加载应用列表失败');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalRuns = apps.reduce((sum, a) => sum + (a.run_count || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* ══ Hero ════════════════════════════════════════════════════ */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* 标签徽章 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI 创客社区
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1]">
            产品社区
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            发现 AI 创作者的精彩应用，点开即玩，无需安装
          </p>

          {/* 统计 + CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isLoading && apps.length > 0 && (
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {apps.length} 个应用
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  {totalRuns.toLocaleString()} 次运行
                </span>
              </div>
            )}
            {isLoggedIn ? (
              <Link to="/publish">
                <Button size="sm" className="rounded-full px-5">
                  <Plus className="w-4 h-4 mr-1.5" />
                  发布应用
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="outline" className="rounded-full px-5">
                  登录后发布
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ══ 应用网格 ════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-28 space-y-4">
            <p className="text-4xl">🚀</p>
            <p className="text-lg font-medium text-foreground">
              还没有应用，成为第一个发布的人！
            </p>
            <p className="text-muted-foreground text-sm">
              把你的 AI 小工具分享给大家
            </p>
            {isLoggedIn ? (
              <Link to="/publish">
                <Button className="mt-2">发布第一个应用</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="mt-2">登录后发布</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
