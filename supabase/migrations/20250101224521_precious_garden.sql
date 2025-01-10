/*
  # Fix RLS policies for storage and tables

  1. Storage Policies
    - Update policies for images bucket
    - Allow public read access
    - Allow authenticated users to upload/delete

  2. Table Policies
    - Update policies for slides, events, and other tables
    - Allow public read access
    - Allow authenticated users to manage records
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete images" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Update table policies
-- Slides
DROP POLICY IF EXISTS "Public can view active slides" ON slides;
DROP POLICY IF EXISTS "Admin can manage slides" ON slides;

CREATE POLICY "Public can view slides"
ON slides FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage slides"
ON slides FOR ALL
TO authenticated
USING (true);

-- Events
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Admin can manage events" ON events;

CREATE POLICY "Public can view events"
ON events FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage events"
ON events FOR ALL
TO authenticated
USING (true);

-- Event images
DROP POLICY IF EXISTS "Public can view event images" ON event_images;
DROP POLICY IF EXISTS "Admin can manage event images" ON event_images;

CREATE POLICY "Public can view event images"
ON event_images FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage event images"
ON event_images FOR ALL
TO authenticated
USING (true);