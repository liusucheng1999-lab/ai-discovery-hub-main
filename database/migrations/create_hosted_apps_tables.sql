-- Create hosted_apps table for storing app metadata
CREATE TABLE IF NOT EXISTS hosted_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  app_file_path VARCHAR(1024) NOT NULL,
  cover_image_url VARCHAR(1024),
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create app_files table for version history
CREATE TABLE IF NOT EXISTS app_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES hosted_apps(id) ON DELETE CASCADE,
  file_path VARCHAR(1024) NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('html', 'zip')),
  version INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hosted_apps_user_id ON hosted_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_hosted_apps_is_published ON hosted_apps(is_published);
CREATE INDEX IF NOT EXISTS idx_app_files_app_id ON app_files(app_id);

-- Enable RLS
ALTER TABLE hosted_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hosted_apps
CREATE POLICY "Users can view their own apps"
  ON hosted_apps
  FOR SELECT
  USING (auth.uid() = user_id OR is_published = true);

CREATE POLICY "Users can insert their own apps"
  ON hosted_apps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own apps"
  ON hosted_apps
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own apps"
  ON hosted_apps
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for app_files
CREATE POLICY "Users can view files of their own apps"
  ON app_files
  FOR SELECT
  USING (
    app_id IN (SELECT id FROM hosted_apps WHERE user_id = auth.uid())
    OR app_id IN (SELECT id FROM hosted_apps WHERE is_published = true)
  );

CREATE POLICY "Users can insert files for their own apps"
  ON app_files
  FOR INSERT
  WITH CHECK (app_id IN (SELECT id FROM hosted_apps WHERE user_id = auth.uid()));
