-- Create the files table for Clerk authentication
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

-- Since we're using Clerk (not Supabase auth), we'll disable RLS for now
-- or create simpler policies
ALTER TABLE files DISABLE ROW LEVEL SECURITY;

-- Create storage bucket for files (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

-- For storage, we'll also disable RLS temporarily to get uploads working
-- You can enable it later with proper policies