-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Weekly schedules are viewable by everyone" ON weekly_schedules;
DROP POLICY IF EXISTS "Admin can manage weekly schedules" ON weekly_schedules;

-- Create new policies
CREATE POLICY "Public can view weekly schedules"
ON weekly_schedules FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can manage weekly schedules"
ON weekly_schedules FOR ALL
TO authenticated
USING (true);