/*
  # Fix User Management Types

  1. Changes
    - Fix type mismatch in get_users function
    - Ensure consistent text type usage
    - Add better error handling
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_users();

-- Recreate get_users function with correct types
CREATE OR REPLACE FUNCTION get_users()
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF (auth.jwt() ->> 'email') != 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT 
    au.id::uuid,
    au.email::text,
    COALESCE(u.role, 'user')::text,
    COALESCE(u.created_at, au.created_at)::timestamptz
  FROM auth.users au
  LEFT JOIN public.users u ON au.id = u.id
  ORDER BY COALESCE(u.created_at, au.created_at) DESC;
END;
$$;

-- Drop existing function
DROP FUNCTION IF EXISTS create_user(text, text, text);

-- Recreate create_user function with explicit type casting
CREATE OR REPLACE FUNCTION create_user(
  p_email text,
  p_password text,
  p_role text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Verify caller is admin
  IF (auth.jwt() ->> 'email') != 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate role
  IF p_role NOT IN ('user', 'admin', 'media') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role,
    aud
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    p_email::text,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('role', p_role::text),
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO v_user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'User created successfully'
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Email already exists'
    );
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;