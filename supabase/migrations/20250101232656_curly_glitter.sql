/*
  # Fix storage and database policies

  1. Storage Policies
    - Allow public read access to downloads bucket
    - Allow authenticated users to manage files in downloads bucket
  
  2. Database Policies
    - Update downloads table policies
    - Fix RLS for authenticated users
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Download Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

-- Create new storage policies for downloads bucket
CREATE POLICY "Public can view downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'downloads');

CREATE POLICY "Authenticated users can upload downloads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'downloads');

CREATE POLICY "Authenticated users can update downloads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'downloads');

CREATE POLICY "Authenticated users can delete downloads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'downloads');

-- Update downloads table policies
DROP POLICY IF EXISTS "Public Download Access" ON downloads;
DROP POLICY IF EXISTS "Admin Upload Policy" ON downloads;

CREATE POLICY "Public can view downloads"
ON downloads FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage downloads"
ON downloads FOR ALL
TO authenticated
USING (true);