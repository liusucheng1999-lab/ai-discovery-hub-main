import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Play, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HostedApp } from '@/types/app';

interface AppCardProps {
  app: HostedApp;
  showActions?: boolean;
  onEdit?: (app: HostedApp) => void;
  onDelete?: (appId: string) => void;
}

export function AppCard({
  app,
  showActions = false,
  onEdit,
  onDelete,
}: AppCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* 封面展示图 */}
      <Link to={`/run/${app.id}`} className="block">
        <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {app.cover_image_url ? (
            <img
              src={app.cover_image_url}
              alt={app.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-10 h-10 mb-2" />
              <span className="text-xs">暂无展示图</span>
            </div>
          )}
        </div>
      </Link>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{app.name}</CardTitle>
            {app.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {app.description}
              </CardDescription>
            )}
          </div>
          {!app.is_published && (
            <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
              草稿
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{app.view_count} 次浏览</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{app.run_count} 次运行</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link to={`/run/${app.id}`} className="flex-1">
              <Button variant="default" className="w-full">
                查看应用
              </Button>
            </Link>
            {showActions && (
              <>
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => onEdit(app)}
                  >
                    编辑
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('确定删除此应用吗？'))
                        onDelete(app.id);
                    }}
                  >
                    删除
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
