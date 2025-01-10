/*
  # Fix admin system and add image management

  1. New Tables
    - `slides`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `user_id` (uuid)

    - `event_images`
      - `id` (uuid, primary key)
      - `event_id` (uuid)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid)

  2. Security
    - Enable RLS
    - Public can view active slides
    - Only admin can manage content
*/

-- Create slides table
CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create event_images table
CREATE TABLE IF NOT EXISTS event_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public can view active slides"
ON slides FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Public can view event images"
ON event_images FOR SELECT
TO public
USING (true);

-- Admin policies
CREATE POLICY "Admin can manage slides"
ON slides FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin can manage event images"
ON event_images FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "Admin can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.jwt() ->> 'email' = 'pastor@ibnv.com.br'
);