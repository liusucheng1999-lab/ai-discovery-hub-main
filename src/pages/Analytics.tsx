import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSiteAnalyticsSummary, type SiteAnalyticsSummary } from "@/lib/site-analytics";

export default function Analytics() {
  const [siteAnalytics, setSiteAnalytics] = useState<SiteAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadAnalytics();
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
            <CardTitle>统计说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>同一浏览器 30 分钟内重复进入，只记 1 次访问。</p>
            <p>不统计 `/admin`、`/login` 等后台页面。</p>
            <p>数据来自 Supabase 表 `site_visits`。</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
