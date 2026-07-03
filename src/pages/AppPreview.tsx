import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { appService } from '@/lib/appService';
import { Code2, X, Copy, Check, Download } from 'lucide-react';
import type { HostedApp } from '@/types/app';

export function AppPreview() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<HostedApp | null>(null);
  const [appHtml, setAppHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      {/* ── 全屏应用 ── */}
      <iframe
        srcDoc={appHtml}
        title={app?.name || '应用'}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
      />

      {/* ── 底部居中源码入口（仅私密应用）── */}
      {app?.is_private && !showSource && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[110] pb-2">
          <button
            onClick={() => setShowSource(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white text-xs rounded-full backdrop-blur-sm transition-all shadow"
          >
            <Code2 className="w-3.5 h-3.5" />
            查看源码
          </button>
        </div>
      )}

      {/* ── 源码面板（右侧滑入）── */}
      {showSource && (
        <>
          <div
            className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSource(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-[130] w-full max-w-2xl flex flex-col bg-gray-950 shadow-2xl">
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
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                >
                  {copied
                    ? <><Check className="w-3.5 h-3.5 text-green-400" />已复制</>
                    : <><Copy className="w-3.5 h-3.5" />复制全部</>
                  }
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  下载源码
                </button>
                <button
                  onClick={() => setShowSource(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
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
