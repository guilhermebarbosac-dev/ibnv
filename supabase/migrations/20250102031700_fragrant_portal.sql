-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin full access on downloads" ON downloads;
DROP POLICY IF EXISTS "Admin full access on events" ON events;
DROP POLICY IF EXISTS "Admin full access on slides" ON slides;
DROP POLICY IF EXISTS "Admin full access on networks" ON networks;
DROP POLICY IF EXISTS "Admin full access on weekly_schedules" ON weekly_schedules;

-- Create policies for admin access
CREATE POLICY "Admin full access on downloads"
ON downloads FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br')
WITH CHECK (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin full access on events"
ON events FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br')
WITH CHECK (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin full access on slides"
ON slides FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br')
WITH CHECK (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin full access on networks"
ON networks FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br')
WITH CHECK (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin full access on weekly_schedules"
ON weekly_schedules FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br')
WITH CHECK (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');