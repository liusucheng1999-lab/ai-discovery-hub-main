import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSiteAnalyticsSummary, fetchVisitDetails, type SiteAnalyticsSummary, type VisitDetail } from "@/lib/site-analytics";

export default function Analytics() {
  const [siteAnalytics, setSiteAnalytics] = useState<SiteAnalyticsSummary | null>(null);
  const [visitDetails, setVisitDetails] = useState<VisitDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalDetails, setTotalDetails] = useState(0);
  const pageSize = 20;

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await fetchSiteAnalyticsSummary();
      setSiteAnalytics(summary);
    } catch (err: any) {
      console.error("加载统计失败:", err);
      setError(err?.message || "加载统计失败");
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (page: number = 0) => {
    try {
      setDetailsLoading(true);
      const { data, total } = await fetchVisitDetails(pageSize, page * pageSize);
      setVisitDetails(data);
      setTotalDetails(total);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("加载详细记录失败:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    loadDetails(0);
  }, []);

  return (
    <>
      <Helmet>
        <title>访问统计 - AI创客</title>
        <meta name="description" content="站点访问统计后台" />
      </Helmet>

      <main className="mx-auto max-w-[1400px] px-6 pt-24 pb-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold">📈 访问统计</h1>
            <p className="text-muted-foreground">
              这里看每天进入站点的次数和最近访问趋势
            </p>
          </div>
          <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
            刷新统计
          </Button>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
            <div className="mt-2 text-muted-foreground">
              如果你还没建表，请先执行 `database/migrations/create_site_visits.sql`。
            </div>
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">今日访问</div>
              <div className="mt-2 text-3xl font-bold">{loading ? "..." : siteAnalytics?.today ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">昨日访问</div>
              <div className="mt-2 text-3xl font-bold">{loading ? "..." : siteAnalytics?.yesterday ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">近 7 天访问</div>
              <div className="mt-2 text-3xl font-bold">{loading ? "..." : siteAnalytics?.last7Days ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">近 30 天访问</div>
              <div className="mt-2 text-3xl font-bold">{loading ? "..." : siteAnalytics?.last30Days ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>最近 14 天访问趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  正在加载访问趋势...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(siteAnalytics?.daily || []).slice(-14).map((item) => ({
                      ...item,
                      label: item.date.slice(5),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value: number) => [`${value} 次`, "访问"]}
                      labelFormatter={(label) => `日期 ${label}`}
                    />
                    <Bar dataKey="visits" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>访问详情</CardTitle>
          </CardHeader>
          <CardContent>
            {detailsLoading && !visitDetails.length ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                加载详细记录中...
              </div>
            ) : visitDetails.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-3 py-3 text-left font-semibold">访问时间</th>
                        <th className="px-3 py-3 text-left font-semibold">IP 地址</th>
                        <th className="px-3 py-3 text-left font-semibold">进入路径</th>
                        <th className="px-3 py-3 text-left font-semibold">设备信息</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitDetails.map((visit) => (
                        <tr key={visit.id} className="border-b hover:bg-muted/30">
                          <td className="px-3 py-3 text-xs">
                            {new Date(visit.created_at).toLocaleString("zh-CN")}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs">
                            {visit.ip_address || <span className="text-muted-foreground">-</span>}
                          </td>
                          <td className="px-3 py-3 max-w-xs truncate text-xs">
                            {visit.entry_path}
                          </td>
                          <td className="px-3 py-3 max-w-xs truncate text-xs text-muted-foreground">
                            {visit.user_agent
                              ? visit.user_agent.split(" ").slice(0, 2).join(" ")
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground">
                    共 {totalDetails} 条记录，第 {currentPage + 1} 页
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadDetails(currentPage - 1)}
                      disabled={currentPage === 0 || detailsLoading}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadDetails(currentPage + 1)}
                      disabled={
                        (currentPage + 1) * pageSize >= totalDetails || detailsLoading
                      }
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                暂无访问记录
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>统计说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>同一浏览器 30 分钟内重复进入，只记 1 次访问。</p>
            <p>不统计 `/admin`、`/login` 等后台页面。</p>
            <p>IP 地址通过 ipify API 获取（可能不显示或延迟）。</p>
            <p>数据来自 Supabase 表 `site_visits`。</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
