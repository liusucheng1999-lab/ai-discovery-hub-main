import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Play } from 'lucide-react';
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
            <Link to={`/apps/${app.id}`}>
              <Button variant="outline">详情</Button>
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
