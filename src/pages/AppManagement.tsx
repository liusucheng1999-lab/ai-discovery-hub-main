import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Lock, Globe, Copy, Check } from 'lucide-react';
import { appService } from '@/lib/appService';
import { AppCard } from '@/components/AppCard';
import { AppEditDialog } from '@/components/AppEditDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

type AppManagementProps = {
  embedded?: boolean;
};

export function AppManagement({ embedded = false }: AppManagementProps) {
  const [apps, setApps] = useState<HostedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingApp, setEditingApp] = useState<HostedApp | null>(null);

  const handleSaved = (updated: HostedApp) => {
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (appId: string) => {
    const url = `${window.location.origin}/run/${appId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(appId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePrivate = async (app: HostedApp) => {
    try {
      const updated = await appService.togglePrivate(app.id, !app.is_private);
      setApps(apps.map((a) => (a.id === app.id ? updated : a)));
      toast.success(updated.is_private ? '已设为私密链接' : '已改为公开，等待审核');
    } catch {
      toast.error('操作失败，请重试');
    }
  };

  const handleResubmit = async (app: HostedApp) => {
    try {
      const updated = await appService.resubmitApp(app.id);
      setApps(apps.map((a) => (a.id === app.id ? updated : a)));
      toast.success('已重新提交，等待管理员审核');
    } catch (error) {
      console.error('Error resubmitting app:', error);
      toast.error('重新提交失败');
    }
  };

  const statusLabel = (app: HostedApp) => {
    if (app.is_private) return { text: '私密链接', cls: 'text-purple-600' };
    if (app.status === 'approved') return { text: '已通过 · 展示中', cls: 'text-green-600' };
    if (app.status === 'rejected') return { text: '已拒绝', cls: 'text-red-600' };
    return { text: '审核中', cls: 'text-yellow-600' };
  };

  const formatSyncTime = (t: string | null) => {
    if (!t) return null;
    const diff = Date.now() - new Date(t).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins} 分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小时前`;
    return `${Math.floor(hours / 24)} 天前`;
  };

  return (
    <div className={embedded ? "container mx-auto py-8 px-4" : "pt-20 container mx-auto py-8 px-4"}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">我的应用</h1>
            <p className="text-gray-600">管理你发布的所有应用</p>
          </div>
          <div className="flex gap-2">
            {!embedded && (
              <Link to="/">
                <Button variant="outline">🏠 产品社区</Button>
              </Link>
            )}
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
            {apps.map((app) => {
              const status = statusLabel(app);
              return (
                <div key={app.id} className="relative">
                  <AppCard
                    app={app}
                    showActions={true}
                    onEdit={() => setEditingApp(app)}
                    onDelete={handleDelete}
                  />
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${status.cls}`}>
                        {app.is_private && <Lock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}
                        状态：{status.text}
                      </p>
                      {/* 复制链接按钮 */}
                      <button
                        onClick={() => handleCopyLink(app.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedId === app.id
                          ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500">已复制</span></>
                          : <><Copy className="w-3.5 h-3.5" />复制链接</>
                        }
                      </button>
                    </div>

                    {/* 私密 / 公开切换 */}
                    <button
                      onClick={() => handleTogglePrivate(app)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {app.is_private
                        ? <><Globe className="w-3.5 h-3.5" />改为公开展示</>
                        : <><Lock className="w-3.5 h-3.5" />改为私密链接</>
                      }
                    </button>

                    {/* GitHub 同步状态 */}
                    {app.github_url && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Github className="w-3.5 h-3.5 shrink-0" />
                        {app.github_synced_at
                          ? `GitHub 同步：${formatSyncTime(app.github_synced_at)}`
                          : 'GitHub 已连接，等待首次同步'}
                      </p>
                    )}
                    {app.status === 'rejected' && !app.is_private && (
                      <>
                        {app.review_note && (
                          <p className="text-xs text-red-500 bg-red-50 rounded p-2">
                            拒绝理由：{app.review_note}
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleResubmit(app)}
                        >
                          重新提交审核
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      <AppEditDialog
        app={editingApp}
        open={editingApp !== null}
        onClose={() => setEditingApp(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
