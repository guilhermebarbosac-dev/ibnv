/*
  # Fix users table and permissions

  1. Changes
    - Drop and recreate users table with correct structure
    - Add proper RLS policies
    - Create admin user with correct permissions
    - Add trigger to automatically add new users

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS users CASCADE;

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
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 
    CASE 
      WHEN new.email = 'pastor@ibnv.com.br' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial admin user if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'pastor@ibnv.com.br',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'pastor@ibnv.com.br'
);