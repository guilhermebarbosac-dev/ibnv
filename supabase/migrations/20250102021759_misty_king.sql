-- Drop existing table and policies
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by admin"
ON users FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin can manage users"
ON users FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Only insert if the user doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
    INSERT INTO public.users (id, email, role)
    VALUES (new.id, new.email, 
      CASE 
        WHEN new.email = 'pastor@ibnv.com.br' THEN 'admin'
        ELSE COALESCE(new.raw_user_meta_data->>'role', 'user')
      END
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure admin user exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'pastor@ibnv.com.br'
  ) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'pastor@ibnv.com.br',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "admin"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  END IF;
END $$;

-- Sync existing auth users to users table
INSERT INTO users (id, email, role)
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'pastor@ibnv.com.br' THEN 'admin'
    ELSE COALESCE(raw_user_meta_data->>'role', 'user')
  END as role
FROM auth.users
ON CONFLICT (id) DO NOTHING;