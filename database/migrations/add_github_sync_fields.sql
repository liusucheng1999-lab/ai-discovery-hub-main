-- 迁移：给 hosted_apps 增加 GitHub 自动同步字段
-- 应用日期：2026-06-25
-- 作用：用户可在编辑应用时绑定 GitHub 仓库中的 HTML 文件，
--       由 Vercel Cron Job（每小时一次）自动从 GitHub 拉取最新内容并更新到 Storage。
--       拉取动作在 Vercel 服务器（境外）执行，国内用户访问不受影响。

ALTER TABLE hosted_apps
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS github_synced_at timestamptz;

-- 快速找到所有配置了 GitHub 的应用（Cron Job 查询时使用）
CREATE INDEX IF NOT EXISTS idx_hosted_apps_github_url
  ON hosted_apps (github_url)
  WHERE github_url IS NOT NULL;
