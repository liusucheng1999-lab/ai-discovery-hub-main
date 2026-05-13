-- 创建课程资源 Storage bucket（public 可读）
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-assets', 'course-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 允许所有人读取
CREATE POLICY "Public read course-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-assets');

-- 允许已登录用户上传
CREATE POLICY "Authenticated upload course-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'course-assets');

-- 允许已登录用户删除自己上传的文件
CREATE POLICY "Authenticated delete course-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'course-assets');
