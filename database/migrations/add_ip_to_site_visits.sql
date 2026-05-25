-- 添加 IP 地址字段到 site_visits 表
ALTER TABLE public.site_visits
ADD COLUMN IF NOT EXISTS ip_address TEXT;

CREATE INDEX IF NOT EXISTS idx_site_visits_ip_address
  ON public.site_visits (ip_address);
