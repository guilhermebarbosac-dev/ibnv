/*
  # Update downloads table policies

  1. Changes
    - Drop existing policies if they exist
    - Recreate policies with updated permissions
    
  2. Security
    - Ensure RLS is enabled
    - Public read access for all users
    - Admin-only management access
*/

-- Enable RLS (idempotent)
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Downloads are viewable by everyone" ON downloads;
DROP POLICY IF EXISTS "Admin users can manage downloads" ON downloads;

-- Recreate policies
CREATE POLICY "Downloads are viewable by everyone" 
ON downloads
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin users can manage downloads"
ON downloads
FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    auth.jwt() ->> 'email' IN (
      'admin@example.com' -- Replace with actual admin email
    )
  )
);