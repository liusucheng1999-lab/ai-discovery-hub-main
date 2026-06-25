import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HostedApp } from '@/types/app';

interface AppCardProps {
  app: HostedApp;
  showActions?: boolean;
  onEdit?: (app: HostedApp) => void;
  onDelete?: (appId: string) => void;
}

/** 根据应用名首字生成一个稳定的渐变背景（无封面时使用） */
const GRADIENTS = [
  'from-violet-500 to-purple-700',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-700',
];
function pickGradient(name: string) {
  return GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
}

export function AppCard({ app, showActions = false, onEdit, onDelete }: AppCardProps) {
  const gradient = pickGradient(app.name);
  const initial = app.name.charAt(0).toUpperCase();

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* ── 封面图区域 ──────────────────────────── */}
      <Link to={`/run/${app.id}`} className="block relative aspect-video overflow-hidden flex-shrink-0">
        {app.cover_image_url ? (
          <img
            src={app.cover_image_url}
            alt={app.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center select-none`}>
            <span className="text-white text-5xl font-extrabold opacity-70 drop-shadow-sm">
              {initial}
            </span>
          </div>
        )}

        {/* 悬浮"立即体验"蒙层 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-full text-sm shadow-lg">
            <Zap className="w-4 h-4 text-primary" />
            立即体验
          </div>
        </div>

        {/* 状态角标（审核中 / 已拒绝） */}
        {app.status === 'pending' && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-amber-400/90 text-amber-900 text-[11px] font-semibold rounded-full shadow-sm backdrop-blur-sm">
            审核中
          </span>
        )}
        {app.status === 'rejected' && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-red-500/90 text-white text-[11px] font-semibold rounded-full shadow-sm backdrop-blur-sm">
            已拒绝
          </span>
        )}
      </Link>

      {/* ── 文字区域 ──────────────────────────── */}
      <Link to={`/run/${app.id}`} className="flex-1 flex flex-col p-4 gap-1 cursor-pointer">
        <h3 className="font-semibold text-foreground text-base leading-snug truncate">
          {app.name}
        </h3>
        {app.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-1">
            {app.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <Play className="w-3 h-3 fill-current" />
          <span>{app.run_count.toLocaleString()} 次运行</span>
        </div>
      </Link>

      {/* ── 管理操作（仅我的应用页显示）──────── */}
      {showActions && (onEdit || onDelete) && (
        <div className="px-4 pb-4 flex gap-2 border-t border-border pt-3">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(app)} className="flex-1">
              编辑
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:border-destructive hover:text-destructive"
              onClick={() => {
                if (confirm('确定删除此应用吗？此操作不可撤销。')) onDelete(app.id);
              }}
            >
              删除
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
