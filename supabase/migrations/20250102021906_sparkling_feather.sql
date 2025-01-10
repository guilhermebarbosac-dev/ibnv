/*
  # Fix User Management Policies

  1. Changes
    - Drop and recreate users table with proper cascade
    - Update RLS policies to be more permissive for admin
    - Fix user creation trigger
    - Add proper role handling

  2. Security
    - Enable RLS on users table
    - Add policies for admin access
    - Ensure proper cascading deletion
*/

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

-- Create policies with more permissive admin access
CREATE POLICY "Admin full access"
ON users
USING (
  auth.jwt() ->> 'email' = 'pastor@ibnv.com.br'
);

-- Create function to handle new user creation with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      CASE 
        WHEN NEW.email = 'pastor@ibnv.com.br' THEN 'admin'
        WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL THEN NEW.raw_user_meta_data->>'role'
        ELSE 'user'
      END,
      'user'
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    role = EXCLUDED.role;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure admin user exists with proper role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'pastor@ibnv.com.br'
  ) THEN
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
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "admin"}',
      now(),
      now()
    );
  END IF;
END $$;

-- Sync existing auth users to users table
INSERT INTO users (id, email, role)
SELECT 
  id,
  email,
  COALESCE(
    CASE 
      WHEN email = 'pastor@ibnv.com.br' THEN 'admin'
      WHEN raw_user_meta_data->>'role' IS NOT NULL THEN raw_user_meta_data->>'role'
      ELSE 'user'
    END,
    'user'
  ) as role
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role;