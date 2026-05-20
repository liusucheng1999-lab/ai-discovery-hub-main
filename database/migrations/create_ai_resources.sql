-- Create ai_resources table
CREATE TABLE IF NOT EXISTS ai_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  keywords TEXT,
  cover_url TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_resources_sort_order ON ai_resources(sort_order);
CREATE INDEX IF NOT EXISTS idx_ai_resources_status ON ai_resources(status);
CREATE INDEX IF NOT EXISTS idx_ai_resources_created_at ON ai_resources(created_at DESC);

-- Create auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at_ai_resources()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_ai_resources ON ai_resources;
CREATE TRIGGER trg_set_updated_at_ai_resources
BEFORE UPDATE ON ai_resources
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_ai_resources();

-- Enable RLS
ALTER TABLE ai_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public read published resources" ON ai_resources;
CREATE POLICY "Public read published resources" ON ai_resources
FOR SELECT USING (status = 'published' AND is_deleted = FALSE);

DROP POLICY IF EXISTS "Admin can read all resources" ON ai_resources;
CREATE POLICY "Admin can read all resources" ON ai_resources
FOR SELECT USING (is_admin_user());

DROP POLICY IF EXISTS "Admin can manage resources" ON ai_resources;
CREATE POLICY "Admin can manage resources" ON ai_resources
FOR ALL USING (is_admin_user());
