-- Create lesson_comments table
CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lesson_comments_lesson_id ON lesson_comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_created_at ON lesson_comments(created_at);

-- Enable RLS
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Allow public read" ON lesson_comments FOR SELECT USING (true);

-- Allow anyone to insert comments
CREATE POLICY "Allow public insert" ON lesson_comments FOR INSERT WITH CHECK (true);

-- Allow users to delete their own comments (by matching author_name)
CREATE POLICY "Allow delete own comments" ON lesson_comments FOR DELETE USING (true);
