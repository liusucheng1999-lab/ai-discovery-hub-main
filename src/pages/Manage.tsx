// src/pages/Manage.tsx
// 管理后台 - 编辑和删除应用

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink, Save, X } from "lucide-react";
import { getToolLogo } from "@/lib/logo-utils";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  category: string;
  tags: string[];
  pricing_type: string;
  is_china_available: boolean;
  is_chinese_supported: boolean;
  rating: number;
  rating_count: number;
  view_count: number;
  screenshots: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Manage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [processing, setProcessing] = useState(false);

  // 加载所有工具
  useEffect(() => {
    async function loadTools() {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('加载工具失败:', error);
        } else {
          setTools(data || []);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTools();
  }, []);

  // 开始编辑
  const startEdit = (tool: Tool) => {
    setEditingTool({ ...tool });
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingTool(null);
  };

  // 保存编辑
  const saveEdit = async () => {
    if (!editingTool) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('tools')
        .update({
          name: editingTool.name,
          tagline: editingTool.tagline,
          description: editingTool.description,
          website_url: editingTool.website_url,
          category: editingTool.category,
          tags: editingTool.tags,
          pricing_type: editingTool.pricing_type,
          is_china_available: editingTool.is_china_available,
          is_chinese_supported: editingTool.is_chinese_supported,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTool.id);

      if (error) {
        console.error('更新失败:', error);
        alert('更新失败，请重试');
      } else {
        // 更新本地状态
        setTools(prev => 
          prev.map(tool => 
            tool.id === editingTool.id ? editingTool : tool
          )
        );
        setEditingTool(null);
        alert('更新成功！');
      }
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  // 删除工具
  const deleteTool = async (toolId: string, toolName: string) => {
    if (!confirm(`确定要删除工具 "${toolName}" 吗？此操作不可恢复。`)) {
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      } else {
        setTools(prev => prev.filter(tool => tool.id !== toolId));
        alert('删除成功！');
      }
    } catch (err) {
      console.error('删除失败:', err);
      alert('删除失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-3">加载中...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>工具管理 - AI创客</title>
        <meta name="description" content="AI工具管理后台" />
      </Helmet>
      
      <main className="mx-auto max-w-[1400px] px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔧 工具管理</h1>
          <p className="text-muted-foreground">管理所有AI工具的基本信息</p>
        </div>

        {/* 工具列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📋 所有工具 ({tools.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">工具</th>
                    <th className="text-left p-3">分类</th>
                    <th className="text-left p-3">价格</th>
                    <th className="text-left p-3">国内可用</th>
                    <th className="text-left p-3">评分</th>
                    <th className="text-left p-3">浏览量</th>
                    <th className="text-left p-3">官网</th>
                    <th className="text-left p-3">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool) => (
                    <tr key={tool.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        {editingTool?.id === tool.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingTool.name}
                              onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              value={editingTool.tagline}
                              onChange={(e) => setEditingTool({ ...editingTool, tagline: e.target.value })}
                              className="w-full p-2 border rounded text-sm"
                            />
                            <input
                              type="url"
                              value={editingTool.website_url}
                              onChange={(e) => setEditingTool({ ...editingTool, website_url: e.target.value })}
                              className="w-full p-2 border rounded text-sm"
                              placeholder="https://example.com"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <img 
                              src={getToolLogo(tool.website_url)} 
                              alt={tool.name}
                              className="w-10 h-10 rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${tool.website_url}&sz=64`;
                              }}
                            />
                            <div>
                              <div className="font-semibold">{tool.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{tool.tagline}</div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {editingTool?.id === tool.id ? (
                          <select
                            value={editingTool.category}
                            onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="chat">聊天助手</option>
                            <option value="image">图像生成</option>
                            <option value="video">视频生成</option>
                            <option value="audio">音频处理</option>
                            <option value="coding">编程工具</option>
                            <option value="writing">写作工具</option>
                            <option value="design">设计工具</option>
                            <option value="office">办公工具</option>
                            <option value="search">搜索引擎</option>
                          </select>
                        ) : (
                          <Badge variant="outline">{tool.category}</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        {editingTool?.id === tool.id ? (
                          <select
                            value={editingTool.pricing_type}
                            onChange={(e) => setEditingTool({ ...editingTool, pricing_type: e.target.value })}
                            className="w-full p-2 border rounded"
                          >
                            <option value="free">免费</option>
                            <option value="freemium">免费增值</option>
                            <option value="paid">付费</option>
                            <option value="opensource">开源</option>
                          </select>
                        ) : (
                          <Badge variant="secondary">{tool.pricing_type}</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        {editingTool?.id === tool.id ? (
                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingTool.is_china_available}
                                onChange={(e) => setEditingTool({ ...editingTool, is_china_available: e.target.checked })}
                              />
                              国内可用
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingTool.is_chinese_supported}
                                onChange={(e) => setEditingTool({ ...editingTool, is_chinese_supported: e.target.checked })}
                              />
                              支持中文
                            </label>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant={tool.is_china_available ? 'default' : 'secondary'}>
                              {tool.is_china_available ? '🇨🇳 可用' : '🌍 需翻墙'}
                            </Badge>
                            {tool.is_chinese_supported && (
                              <Badge variant="outline">支持中文</Badge>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {editingTool?.id === tool.id ? (
                          <input
                            type="number"
                            value={editingTool.rating}
                            onChange={(e) => setEditingTool({ ...editingTool, rating: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded"
                            step="0.1"
                            min="0"
                            max="5"
                          />
                        ) : (
                          <div className="text-sm">
                            ⭐ {tool.rating} ({tool.rating_count} 评价)
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-muted-foreground">
                          👁️ {tool.view_count}
                        </div>
                      </td>
                      <td className="p-3">
                        {editingTool?.id === tool.id ? (
                          <input
                            type="url"
                            value={editingTool.website_url}
                            onChange={(e) => setEditingTool({ ...editingTool, website_url: e.target.value })}
                            className="w-full p-2 border rounded text-sm"
                            placeholder="https://example.com"
                          />
                        ) : (
                          <a 
                            href={tool.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            {tool.website_url}
                          </a>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <a 
                            href={tool.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline p-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          
                          {editingTool?.id === tool.id ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={saveEdit}
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(tool)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteTool(tool.id, tool.name)}
                                disabled={processing}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 空状态 */}
        {tools.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">暂无工具</div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
