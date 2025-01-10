/*
  # Update networks table policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies allowing authenticated users to manage networks
    - Keep public read access

  2. Security
    - Public can view networks
    - Authenticated users can manage networks (create, read, update, delete)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Networks are viewable by everyone" ON networks;
DROP POLICY IF EXISTS "Admin can manage networks" ON networks;

-- Create new policies
CREATE POLICY "Public can view networks"
ON networks FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage networks"
ON networks FOR ALL
TO authenticated
USING (true);