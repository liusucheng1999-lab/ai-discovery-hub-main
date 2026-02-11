// src/pages/Admin.tsx
// 管理员审核后台

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, ExternalLink } from "lucide-react";

interface ToolSubmission {
  id: string;
  name: string;
  website_url: string;
  tagline: string;
  category: string;
  pricing_type: string;
  is_china_available: boolean;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function Admin() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  // 加载待审核工具
  useEffect(() => {
    async function loadSubmissions() {
      try {
        const { data, error } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('加载待审核工具失败:', error);
        } else {
          setSubmissions(data || []);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  // 批量审核通过
  const handleApprove = async () => {
    if (selectedIds.length === 0) return;
    
    setProcessing(true);
    try {
      // 获取选中的工具详情
      const { data: selectedTools } = await supabase
        .from('tool_submissions')
        .select('*')
        .in('id', selectedIds);

      if (selectedTools && selectedTools.length > 0) {
        // 转换并插入到主表
        const toolsToInsert = selectedTools.map(tool => ({
          name: tool.name,
          tagline: tool.tagline,
          description: tool.tagline,
          website_url: tool.website_url,
          category: tool.category,
          tags: [tool.category],
          pricing_type: tool.pricing_type,
          is_china_available: tool.is_china_available,
          is_chinese_supported: tool.note?.includes('支持中文: true') || false,
          rating: 0,
          rating_count: 0,
          view_count: 0,
          screenshots: [],
          status: 'active',
          created_at: new Date().toISOString()
        }));

        // 插入到主表
        const { error: insertError } = await supabase
          .from('tools')
          .insert(toolsToInsert);

        if (insertError) {
          console.error('插入工具失败:', insertError);
          alert('插入工具失败，请检查数据');
          return;
        }

        // 更新待审核表状态
        const { error: updateError } = await supabase
          .from('tool_submissions')
          .update({ status: 'approved' })
          .in('id', selectedIds);

        if (updateError) {
          console.error('更新状态失败:', updateError);
          alert('更新状态失败');
        } else {
          // 刷新列表
          setSubmissions(prev => 
            prev.filter(tool => !selectedIds.includes(tool.id))
          );
          setSelectedIds([]);
          alert(`成功审核通过 ${selectedTools.length} 个工具！`);
        }
      }
    } catch (err) {
      console.error('审核失败:', err);
      alert('审核失败，请重试');
    } finally {
      setProcessing(false);
    }
  };

  // 批量拒绝
  const handleReject = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm('确定要拒绝这些工具吗？')) return;
    
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('tool_submissions')
        .update({ status: 'rejected' })
        .in('id', selectedIds);

      if (error) {
        console.error('拒绝失败:', error);
        alert('拒绝失败');
      } else {
        setSubmissions(prev => 
          prev.filter(tool => !selectedIds.includes(tool.id))
        );
        setSelectedIds([]);
        alert(`已拒绝 ${selectedIds.length} 个工具`);
      }
    } catch (err) {
      console.error('拒绝失败:', err);
      alert('拒绝失败');
    } finally {
      setProcessing(false);
    }
  };

  // 选择/取消选择
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const pendingIds = submissions
      .filter(tool => tool.status === 'pending')
      .map(tool => tool.id);
    
    if (selectedIds.length === pendingIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingIds);
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

  const pendingSubmissions = submissions.filter(tool => tool.status === 'pending');
  const approvedSubmissions = submissions.filter(tool => tool.status === 'approved');
  const rejectedSubmissions = submissions.filter(tool => tool.status === 'rejected');

  return (
    <>
      <Helmet>
        <title>审核管理 - AI创客</title>
        <meta name="description" content="AI工具审核管理后台" />
      </Helmet>
      
      <main className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛠️ 审核管理</h1>
          <p className="text-muted-foreground">管理待审核的AI工具提交</p>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{pendingSubmissions.length}</div>
              <div className="text-sm text-muted-foreground">待审核</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{approvedSubmissions.length}</div>
              <div className="text-sm text-muted-foreground">已通过</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{rejectedSubmissions.length}</div>
              <div className="text-sm text-muted-foreground">已拒绝</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <div className="text-sm text-muted-foreground">总提交</div>
            </CardContent>
          </Card>
        </div>

        {/* 批量操作 */}
        {pendingSubmissions.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={toggleSelectAll}
            >
              {selectedIds.length === pendingSubmissions.length ? '取消全选' : '全选'}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={selectedIds.length === 0 || processing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              批量通过 ({selectedIds.length})
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={selectedIds.length === 0 || processing}
            >
              <X className="h-4 w-4 mr-2" />
              批量拒绝 ({selectedIds.length})
            </Button>
          </div>
        )}

        {/* 待审核列表 */}
        {pendingSubmissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">📋 待审核工具 ({pendingSubmissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSubmissions.map((tool) => (
                  <div 
                    key={tool.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedIds.includes(tool.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleSelection(tool.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(tool.id)}
                            onChange={() => {}}
                            className="h-4 w-4"
                          />
                          <h3 className="font-semibold text-lg">{tool.name}</h3>
                          <Badge variant={tool.is_china_available ? 'default' : 'secondary'}>
                            {tool.is_china_available ? '🇨🇳 国内可用' : '🌍 需翻墙'}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{tool.tagline}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">分类：</span>
                            <span className="ml-1">{tool.category}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">价格：</span>
                            <span className="ml-1">{tool.pricing_type}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">官网：</span>
                            <a 
                              href={tool.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline ml-1"
                            >
                              访问链接
                            </a>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">备注：</span>
                            <span className="ml-1">{tool.note}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 已审核列表 */}
        {(approvedSubmissions.length > 0 || rejectedSubmissions.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">📋 已审核工具</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...approvedSubmissions, ...rejectedSubmissions].map((tool) => (
                  <div key={tool.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <Badge variant={tool.status === 'approved' ? 'default' : 'secondary'}>
                        {tool.status === 'approved' ? '✅ 已通过' : '❌ 已拒绝'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{tool.tagline}</p>
                    <div className="text-sm text-muted-foreground">
                      <span>分类：{tool.category} | 价格：{tool.pricing_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
