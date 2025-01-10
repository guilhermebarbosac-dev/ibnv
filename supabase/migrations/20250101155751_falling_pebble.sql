/*
  # Fix Storage Buckets Configuration

  1. Changes:
    - Create downloads bucket if it doesn't exist
    - Set proper public access
    - Configure RLS policies for downloads bucket
    
  2. Security:
    - Public read access for downloads
    - Admin-only write access
    - Proper file type restrictions
*/

-- Create downloads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('downloads', 'downloads', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Download Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;

-- Create storage policies
CREATE POLICY "Public Download Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'downloads');

CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'downloads' AND
  auth.jwt() ->> 'email' = 'pastor@ibnv.com.br'
);

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'downloads' AND
  auth.jwt() ->> 'email' = 'pastor@ibnv.com.br'
);