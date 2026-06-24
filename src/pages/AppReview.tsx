import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, ExternalLink } from 'lucide-react';
import { appService } from '@/lib/appService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { HostedApp } from '@/types/app';

export function AppReview() {
  const [apps, setApps] = useState<HostedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejecting, setRejecting] = useState<HostedApp | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadApps = async () => {
    try {
      setIsLoading(true);
      const data = await appService.getPendingApps();
      setApps(data);
    } catch (error) {
      console.error('Error loading pending apps:', error);
      toast.error('加载待审核应用失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleApprove = async (app: HostedApp) => {
    try {
      setBusyId(app.id);
      await appService.reviewApp(app.id, 'approved');
      setApps((prev) => prev.filter((a) => a.id !== app.id));
      toast.success(`已通过：${app.name}`);
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('操作失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejecting) return;
    try {
      setBusyId(rejecting.id);
      await appService.reviewApp(rejecting.id, 'rejected', rejectNote);
      setApps((prev) => prev.filter((a) => a.id !== rejecting.id));
      toast.success(`已拒绝：${rejecting.name}`);
      setRejecting(null);
      setRejectNote('');
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('操作失败');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="pt-20 container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">应用审核</h1>
          <p className="text-gray-600">审核用户提交的应用，通过后才会在「项目展示」公开</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">🎉 没有待审核的应用</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className="border rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {app.cover_image_url ? (
                    <img
                      src={app.cover_image_url}
                      alt={app.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs">暂无展示图</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    {app.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {app.description}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    提交时间：{new Date(app.created_at).toLocaleString('zh-CN')}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Link to={`/run/${app.id}`} target="_blank" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        预览
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={busyId === app.id}
                      onClick={() => handleApprove(app)}
                    >
                      通过
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      disabled={busyId === app.id}
                      onClick={() => {
                        setRejecting(app);
                        setRejectNote('');
                      }}
                    >
                      拒绝
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 拒绝理由弹窗 */}
      <Dialog open={rejecting !== null} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>拒绝「{rejecting?.name}」</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              拒绝理由（会展示给提交者）
            </label>
            <Textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="例如：内容不符合规范 / 应用无法正常运行 / 请补充说明…"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={busyId === rejecting?.id}
            >
              确认拒绝
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
