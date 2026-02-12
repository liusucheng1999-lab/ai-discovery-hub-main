// src/pages/Admin.tsx
// 管理员审核后台

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, ExternalLink } from "lucide-react";
import { getToolLogo } from "@/lib/logo-utils";

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
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

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
    
    if (!confirm('确定要审核通过这些工具吗？')) return;
    
    setProcessing(true);
    try {
      console.log('开始审核，选中的ID:', selectedIds);
      
      // 获取选中的工具详情
      const { data: selectedTools, error: fetchError } = await supabase
        .from('tool_submissions')
        .select('*')
        .in('id', selectedIds);

      if (fetchError) {
        console.error('获取工具详情失败:', fetchError);
        alert('获取工具详情失败');
        return;
      }

      console.log('获取到的工具:', selectedTools);

      if (selectedTools && selectedTools.length > 0) {
        // 逐个插入到主表，使用直接插入
        let successCount = 0;
        for (const tool of selectedTools) {
          const toolToInsert = {
            name: tool.name,
            tagline: tool.tagline,
            description: tool.tagline,
            website_url: tool.website_url,
            category: tool.category,
            tags: [tool.category], // 确保是有效的分类
            pricing_type: tool.pricing_type,
            is_china_available: tool.is_china_available,
            is_chinese_supported: tool.note?.includes('支持中文: true') || false,
            rating: 0,
            rating_count: 0,
            view_count: 0,
            screenshots: [], // 空数组，Supabase 会自动处理
            status: 'active',
            created_at: new Date().toISOString()
          };

          console.log('插入工具:', toolToInsert);

          // 直接插入到 tools 表
          const { data, error } = await supabase
            .from('tools')
            .insert(toolToInsert);

          if (error) {
            console.error(`插入工具 ${tool.name} 失败:`, error);
            console.error('错误详情:', error.details);
            console.error('错误代码:', error.code);
            // 继续处理其他工具，不中断整个流程
            continue;
          } else {
            console.log(`成功插入工具 ${tool.name}`);
            successCount++;
          }
        }

        console.log(`成功插入 ${successCount} 个工具，开始更新状态`);

        // 更新待审核表状态
        const { error: updateError } = await supabase
          .from('tool_submissions')
          .update({ status: 'approved' })
          .in('id', selectedIds);

        if (updateError) {
          console.error('更新状态失败:', updateError);
          alert('更新状态失败');
        } else {
          console.log('状态更新成功，重新获取数据');
          // 重新获取所有状态的数据
          const { data: refreshedData } = await supabase
            .from('tool_submissions')
            .select('*')
            .order('created_at', { ascending: false });
          
          setSubmissions(refreshedData || []);
          setSelectedIds([]);
          alert(`成功审核通过 ${successCount} 个工具！`);
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
        // 重新获取所有状态的数据
        const { data: refreshedData } = await supabase
          .from('tool_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        setSubmissions(refreshedData || []);
        setSelectedIds([]);
        alert('已拒绝选中的工具');
      }
    } catch (err) {
      console.error('拒绝失败:', err);
      alert('拒绝失败，请重试');
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
    const currentTabIds = submissions
      .filter(tool => tool.status === activeTab)
      .map(tool => tool.id);
    
    if (selectedIds.length === currentTabIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentTabIds);
    }
  };

  // 获取当前标签页的数据
  const currentTabSubmissions = submissions.filter(tool => tool.status === activeTab);
  const pendingCount = submissions.filter(tool => tool.status === 'pending').length;
  const approvedCount = submissions.filter(tool => tool.status === 'approved').length;
  const rejectedCount = submissions.filter(tool => tool.status === 'rejected').length;

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
        <title>审核管理 - AI创客</title>
        <meta name="description" content="AI工具审核管理后台" />
      </Helmet>
      
      <main className="mx-auto max-w-[1400px] px-6 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛠️ 审核管理</h1>
          <p className="text-muted-foreground">管理待审核的AI工具提交</p>
        </div>

        {/* 状态标签页 */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pending' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            待审核 ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'approved' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            已通过 ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'rejected' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            已拒绝 ({rejectedCount})
          </button>
        </div>

        {/* 批量操作 - 只在待审核页面显示 */}
        {activeTab === 'pending' && currentTabSubmissions.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={toggleSelectAll}
            >
              {selectedIds.length === currentTabSubmissions.length ? '取消全选' : '全选'}
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

        {/* 工具表格 */}
        {currentTabSubmissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {activeTab === 'pending' && '📋 待审核工具'}
                {activeTab === 'approved' && '✅ 已通过工具'}
                {activeTab === 'rejected' && '❌ 已拒绝工具'}
                ({currentTabSubmissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      {activeTab === 'pending' && (
                        <th className="text-left p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.length === currentTabSubmissions.length}
                            onChange={toggleSelectAll}
                            className="h-4 w-4"
                          />
                        </th>
                      )}
                      <th className="text-left p-3">工具</th>
                      <th className="text-left p-3">分类</th>
                      <th className="text-left p-3">价格</th>
                      <th className="text-left p-3">国内可用</th>
                      <th className="text-left p-3">官网</th>
                      <th className="text-left p-3">备注</th>
                      <th className="text-left p-3">提交时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTabSubmissions.map((tool) => (
                      <tr 
                        key={tool.id}
                        className={`border-b hover:bg-muted/50 transition-colors ${
                          selectedIds.includes(tool.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        {activeTab === 'pending' && (
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(tool.id)}
                              onChange={() => toggleSelection(tool.id)}
                              className="h-4 w-4"
                            />
                          </td>
                        )}
                        <td className="p-3">
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
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{tool.category}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{tool.pricing_type}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={tool.is_china_available ? 'default' : 'secondary'}>
                            {tool.is_china_available ? '🇨🇳 可用' : '🌍 需翻墙'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <a 
                            href={tool.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            访问
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground max-w-xs truncate">
                          {tool.note}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(tool.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {currentTabSubmissions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                {activeTab === 'pending' && '暂无待审核工具'}
                {activeTab === 'approved' && '暂无已通过工具'}
                {activeTab === 'rejected' && '暂无已拒绝工具'}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
