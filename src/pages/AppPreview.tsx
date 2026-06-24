import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appService } from '@/lib/appService';
import { ArrowLeft } from 'lucide-react';
import type { HostedApp } from '@/types/app';

/**
 * 独立全屏应用预览页面
 * 路由：/run/:id
 * 应用全屏运行，不带网站导航栏/页脚
 */
export function AppPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<HostedApp | null>(null);
  const [appHtml, setAppHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApp = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const appData = await appService.getApp(id);
        setApp(appData);

        const html = await appService.getAppHtmlContent(appData.app_file_path);
        setAppHtml(html);

        // 运行计数后台静默执行，不阻塞应用显示
        void appService.incrementRunCount(id);
      } catch (err) {
        console.error('Error loading app:', err);
        setError(err instanceof Error ? err.message : '加载应用失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadApp();
  }, [id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">应用加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !appHtml) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '应用不存在'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      {/* 悬浮返回按钮 */}
      <button
        onClick={() => navigate('/published-apps')}
        className="fixed top-4 left-4 z-[110] flex items-center gap-1.5 px-3 py-2 bg-black/70 hover:bg-black/85 text-white text-sm rounded-full backdrop-blur transition-colors shadow-lg"
        title="返回项目展示"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      {/* 全屏应用 */}
      <iframe
        srcDoc={appHtml}
        title={app?.name || '应用'}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
}
