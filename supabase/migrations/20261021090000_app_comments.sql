BEGIN;
ALTER TABLE public.hosted_apps ADD COLUMN IF NOT EXISTS publisher_name text;
UPDATE public.hosted_apps a SET publisher_name = coalesce(nullif(u.raw_user_meta_data->>'display_name', ''), nullif(u.raw_user_meta_data->>'full_name', ''), nullif(split_part(u.email, '@', 1), ''), '用户') FROM auth.users u WHERE u.id = a.user_id AND a.publisher_name IS NULL;
CREATE OR REPLACE FUNCTION public.set_app_publisher_name() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 SELECT coalesce(nullif(raw_user_meta_data->>'display_name', ''), nullif(raw_user_meta_data->>'full_name', ''), nullif(split_part(email, '@', 1), ''), '用户') INTO NEW.publisher_name FROM auth.users WHERE id = NEW.user_id;
 RETURN NEW;
END;
$$;
CREATE TRIGGER set_app_publisher_name BEFORE INSERT OR UPDATE ON public.hosted_apps FOR EACH ROW EXECUTE FUNCTION public.set_app_publisher_name();
CREATE TABLE public.app_comments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 app_id uuid NOT NULL REFERENCES public.hosted_apps(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 author_name text NOT NULL DEFAULT '用户',
 content text NOT NULL CHECK (char_length(btrim(content)) BETWEEN 1 AND 1000),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX app_comments_app_time ON public.app_comments(app_id, created_at DESC);
CREATE OR REPLACE FUNCTION public.set_app_comment_author() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 NEW.user_id := auth.uid();
 NEW.created_at := now();
 NEW.content := btrim(NEW.content);
 SELECT coalesce(nullif(raw_user_meta_data->>'display_name', ''), nullif(raw_user_meta_data->>'full_name', ''), nullif(split_part(email, '@', 1), ''), '用户') INTO NEW.author_name FROM auth.users WHERE id = NEW.user_id;
 RETURN NEW;
END;
$$;
CREATE TRIGGER set_app_comment_author BEFORE INSERT ON public.app_comments FOR EACH ROW EXECUTE FUNCTION public.set_app_comment_author();
ALTER TABLE public.app_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read public app comments" ON public.app_comments FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.hosted_apps a WHERE a.id = app_id AND a.status = 'approved' AND NOT a.is_private));
CREATE POLICY "comment on public apps" ON public.app_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.hosted_apps a WHERE a.id = app_id AND a.status = 'approved' AND NOT a.is_private));
GRANT SELECT ON public.app_comments TO anon, authenticated;
GRANT INSERT ON public.app_comments TO authenticated;
COMMIT;
