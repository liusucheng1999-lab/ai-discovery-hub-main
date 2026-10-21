BEGIN;
ALTER TABLE public.hosted_apps ADD COLUMN publisher_avatar_url text;
ALTER TABLE public.app_comments ADD COLUMN author_avatar_url text;
CREATE OR REPLACE FUNCTION public.set_app_publisher_name() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 SELECT coalesce(nullif(raw_user_meta_data->>'display_name', ''), nullif(raw_user_meta_data->>'full_name', ''), nullif(split_part(email, '@', 1), ''), '用户'), nullif(raw_user_meta_data->>'avatar_url', '') INTO NEW.publisher_name, NEW.publisher_avatar_url FROM auth.users WHERE id = NEW.user_id;
 RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.set_app_comment_author() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 NEW.user_id := auth.uid();
 NEW.created_at := now();
 NEW.content := btrim(NEW.content);
 SELECT coalesce(nullif(raw_user_meta_data->>'display_name', ''), nullif(raw_user_meta_data->>'full_name', ''), nullif(split_part(email, '@', 1), ''), '用户'), nullif(raw_user_meta_data->>'avatar_url', '') INTO NEW.author_name, NEW.author_avatar_url FROM auth.users WHERE id = NEW.user_id;
 RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION public.sync_account_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE account_name text;
BEGIN
 account_name := coalesce(nullif(NEW.raw_user_meta_data->>'display_name', ''), nullif(NEW.raw_user_meta_data->>'full_name', ''), nullif(split_part(NEW.email, '@', 1), ''), '用户');
 UPDATE public.hosted_apps SET publisher_name = account_name, publisher_avatar_url = nullif(NEW.raw_user_meta_data->>'avatar_url', '') WHERE user_id = NEW.id;
 UPDATE public.app_comments SET author_name = account_name, author_avatar_url = nullif(NEW.raw_user_meta_data->>'avatar_url', '') WHERE user_id = NEW.id;
 RETURN NEW;
END;
$$;
CREATE TRIGGER sync_account_profile AFTER UPDATE OF raw_user_meta_data ON auth.users FOR EACH ROW WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data) EXECUTE FUNCTION public.sync_account_profile();
UPDATE public.hosted_apps a SET publisher_avatar_url = nullif(u.raw_user_meta_data->>'avatar_url', '') FROM auth.users u WHERE u.id = a.user_id;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "read avatars" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'avatars');
CREATE POLICY "upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "remove own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
COMMIT;
