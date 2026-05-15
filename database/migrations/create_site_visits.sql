-- 站点访问统计表
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  entry_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visit_date DATE NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Shanghai')::date),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_visits_visit_date
  ON public.site_visits (visit_date DESC);

CREATE INDEX IF NOT EXISTS idx_site_visits_created_at
  ON public.site_visits (created_at DESC);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert site visits" ON public.site_visits;
CREATE POLICY "Anyone can insert site visits"
  ON public.site_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read site visits" ON public.site_visits;
CREATE POLICY "Anyone can read site visits"
  ON public.site_visits
  FOR SELECT
  TO anon, authenticated
  USING (true);
