import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appService } from '@/lib/appService';
import { ArrowLeft, Code2, X, Copy, Check, Download } from 'lucide-react';
import type { HostedApp } from '@/types/app';

/**
 * 独立全屏应用预览页面
 * 路由：/run/:id
 * 应用全屏运行，不带网站导航栏/页脚
 * 私密应用额外显示「查看源码」入口
 */
export function AppPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<HostedApp | null>(null);
  const [appHtml, setAppHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 源码面板状态
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

  // 工具栏显隐：鼠标移动时显示，静止 3 秒后淡出
  const [showControls, setShowControls] = useState(false);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  React.useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  useEffect(() => {
    const loadApp = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const appData = await appService.getApp(id);
        setApp(appData);
        const html = await appService.getAppHtmlContent(appData.app_file_path, appData.updated_at);
        setAppHtml(html);
        void appService.incrementRunCount(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载应用失败');
      } finally {
        setIsLoading(false);
      }
    };
    loadApp();
  }, [id]);

  const handleCopy = async () => {
    if (!appHtml) return;
    await navigator.clipboard.writeText(appHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!appHtml || !app) return;
    const blob = new Blob([appHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.name.replace(/[^a-zA-Z0-9一-龥_-]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
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
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white" onMouseMove={handleMouseMove}>
      {/* ── 悬浮工具栏（鼠标移动时显示，静止后淡出）── */}
      <div className={`fixed top-4 left-4 z-[110] flex items-center gap-2 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-2 bg-black/70 hover:bg-black/85 text-white text-sm rounded-full backdrop-blur transition-colors shadow-lg"
          title="返回产品社区"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        {/* 源码按钮（仅私密应用显示） */}
        {app?.is_private && (
          <button
            onClick={() => setShowSource(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/70 hover:bg-black/85 text-white text-sm rounded-full backdrop-blur transition-colors shadow-lg"
            title="查看源代码"
          >
            <Code2 className="w-4 h-4" />
            源码
          </button>
        )}
      </div>

      {/* ── 全屏应用 ──────────────────────────────── */}
      <iframe
        srcDoc={appHtml}
        title={app?.name || '应用'}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
      />

      {/* ── 源码面板（右侧滑入）─────────────────── */}
      {showSource && (
        <>
          {/* 遮罩 */}
          <div
            className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSource(false)}
          />

          {/* 面板 */}
          <div className="fixed top-0 right-0 bottom-0 z-[130] w-full max-w-2xl flex flex-col bg-gray-950 shadow-2xl">
            {/* 面板头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-200">
                  {app?.name} · 源代码
                </span>
                <span className="text-xs text-gray-500">
                  {(new TextEncoder().encode(appHtml).length / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* 复制按钮 */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                >
                  {copied
                    ? <><Check className="w-3.5 h-3.5 text-green-400" />已复制</>
                    : <><Copy className="w-3.5 h-3.5" />复制全部</>
                  }
                </button>
                {/* 下载按钮 */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  下载源码
                </button>
                {/* 关闭 */}
                <button
                  onClick={() => setShowSource(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 代码内容 */}
            <div className="flex-1 overflow-auto">
              <pre className="p-4 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
                {appHtml}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
