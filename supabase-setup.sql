-- Create the files table
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  user_id TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  modified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own files
CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own files
CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own files
CREATE POLICY "Users can update their own files" ON files
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create storage bucket for files (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload files
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');

-- Create storage policy to allow users to view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);