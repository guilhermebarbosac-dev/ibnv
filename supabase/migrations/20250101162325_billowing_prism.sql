/*
  # Add Weekly Schedule and Networks Tables

  1. New Tables
    - `weekly_schedules`
      - `id` (uuid, primary key)
      - `day_of_week` (text)
      - `title` (text)
      - `time` (time)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

    - `networks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for public viewing and admin management
*/

-- Create weekly_schedules table
CREATE TABLE IF NOT EXISTS weekly_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  title text NOT NULL,
  time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create networks table
CREATE TABLE IF NOT EXISTS networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE weekly_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;

-- Create policies for weekly_schedules
CREATE POLICY "Weekly schedules are viewable by everyone"
ON weekly_schedules FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin can manage weekly schedules"
ON weekly_schedules FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

-- Create policies for networks
CREATE POLICY "Networks are viewable by everyone"
ON networks FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin can manage networks"
ON networks FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');