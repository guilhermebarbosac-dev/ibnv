/*
  # Add admin user and storage setup

  1. Changes
    - Create admin user
    - Create storage bucket for downloads
    - Update downloads table structure
    
  2. Security
    - Set up admin user credentials
    - Configure storage policies
*/

-- Create storage bucket for downloads
INSERT INTO storage.buckets (id, name)
VALUES ('downloads', 'downloads')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'downloads');

CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'downloads' AND
  auth.role() = 'authenticated' AND (
    auth.jwt() ->> 'email' = 'pastor@ibnv.com.br'
  )
);

-- Update downloads table structure
ALTER TABLE downloads
ADD COLUMN IF NOT EXISTS file_type text,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Update policies
CREATE POLICY "Public Download Access"
ON downloads FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin Upload Policy"
ON downloads FOR INSERT
TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.jwt() ->> 'email' = 'pastor@ibnv.com.br'
);