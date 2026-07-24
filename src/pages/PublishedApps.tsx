import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Rocket, Zap, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { appService } from '@/lib/appService';
import { AppCard } from '@/components/AppCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';
import { AppManagement } from './AppManagement';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [apps, setApps] = useState<HostedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const activeTab = isLoggedIn && searchParams.get('tab') === 'my-apps' ? 'my-apps' : 'community';

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

  const switchTab = (tab: 'community' | 'my-apps') => {
    if (tab === 'community') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: 'my-apps' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI创客 - Vibe Coding AI 应用部署平台</title>
        <meta name="description" content="从灵感到上线，用 AI 完成代码并一键部署应用。无需配置服务器，一个链接即可运行、分享和迭代。" />
        <meta name="keywords" content="Vibe Coding,AI部署平台,AI应用,HTML应用托管,AI创客,AI编程" />
        <meta property="og:title" content="AI创客，让每个想法都能上线" />
        <meta property="og:description" content="面向 Vibe Coding 创作者的 AI 应用部署平台：无需配置服务器，一个链接即可运行和分享。" />
        <meta property="og:url" content="https://aimakerbox.com/" />
        <link rel="canonical" href="https://aimakerbox.com/" />
      </Helmet>

      <div className="relative pt-24 pb-12 px-4 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5 border border-primary/20">
            <Rocket className="w-3.5 h-3.5" />
            Vibe Coding · AI 部署平台
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.15]">
            AI创客，让每个想法都能上线
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            用 AI 完成代码，用 AI创客一键上线。无需配置服务器，一个链接即可运行、分享与持续迭代。
          </p>

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
          <Link
            to={isLoggedIn ? '/publish' : '/login'}
            className="group mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3.5 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/30 hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span><strong className="font-semibold text-foreground">新功能：</strong>用 Codex 一键构建并发布，无需 GitHub</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {isLoggedIn && (
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center border-b border-border">
            <button
              type="button"
              onClick={() => switchTab('community')}
              className={`relative px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'community' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              产品社区
              {activeTab === 'community' && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
            <button
              type="button"
              onClick={() => switchTab('my-apps')}
              className={`relative px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'my-apps' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              我的应用
              {activeTab === 'my-apps' && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'my-apps' ? (
        <AppManagement embedded />
      ) : (
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-20">
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
      )}
    </div>
  );
}
