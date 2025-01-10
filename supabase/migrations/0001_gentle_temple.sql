/*
  # Create downloads table for church files

  1. New Tables
    - `downloads`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text, nullable)
      - `file_url` (text)
      - `file_type` (text)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `downloads` table
    - Add policies for authenticated users to read all files
    - Add policies for admin users to manage files
*/

CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read downloads
CREATE POLICY "Downloads are viewable by authenticated users"
  ON downloads
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin users to manage downloads
CREATE POLICY "Admin users can manage downloads"
  ON downloads
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );