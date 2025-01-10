/*
  # Add metadata fields to downloads table

  1. Changes
    - Add month, year, and category columns to downloads table
    - Update existing policies
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to downloads table
ALTER TABLE downloads
ADD COLUMN IF NOT EXISTS month text,
ADD COLUMN IF NOT EXISTS year integer,
ADD COLUMN IF NOT EXISTS category text;