-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_schedules ENABLE ROW LEVEL SECURITY;

-- Create admin user if not exists
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- First check if admin user exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'pastor@ibnv.com.br';

  -- If admin doesn't exist, create them
  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pastor@ibnv.com.br',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "admin"}'::jsonb,
      now(),
      now()
    )
    RETURNING id INTO v_user_id;

    -- Insert into public.users table
    INSERT INTO public.users (id, email, role)
    VALUES (v_user_id, 'pastor@ibnv.com.br', 'admin');
  END IF;
END $$;

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