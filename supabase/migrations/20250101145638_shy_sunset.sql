/*
  # Fix events table structure
  
  1. Changes
    - Drop and recreate events table with correct structure
    - Recreate RLS policies
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS events CASCADE;

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time NOT NULL,
  image_url text,
  is_cancelled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Events are viewable by everyone"
ON events FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin can manage events"
ON events FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');