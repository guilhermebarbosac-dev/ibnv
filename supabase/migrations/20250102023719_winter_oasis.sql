/*
  # Fix User Management Type Issues

  1. Updates
    - Fix type handling in get_users function
    - Add proper type casting for all columns
    - Ensure consistent type handling across functions
*/

-- Drop existing functions to recreate with proper types
DROP FUNCTION IF EXISTS get_users();
DROP FUNCTION IF EXISTS create_user(text, text, text);
DROP FUNCTION IF EXISTS change_user_password(uuid, text);

-- Function to get all users (admin only)
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
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.email = auth.jwt() ->> 'email' 
    AND auth.users.email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Use explicit type casting for all columns
  RETURN QUERY
  SELECT 
    au.id::uuid,
    au.email::text,
    (CASE 
      WHEN au.email = 'pastor@ibnv.com.br' THEN 'admin'
      ELSE COALESCE(u.role, 'user')
    END)::text as role,
    COALESCE(u.created_at, au.created_at)::timestamptz
  FROM auth.users au
  LEFT JOIN public.users u ON u.id = au.id
  ORDER BY COALESCE(u.created_at, au.created_at) DESC;
END;
$$;

-- Function to create new user (admin only)
CREATE OR REPLACE FUNCTION create_user(
  p_email text,
  p_password text,
  p_role text DEFAULT 'user'
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
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.email = auth.jwt() ->> 'email' 
    AND auth.users.email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate inputs
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  IF p_password IS NULL OR length(p_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters';
  END IF;

  IF p_role NOT IN ('user', 'admin', 'media') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  -- Create user in auth schema with explicit type casting
  INSERT INTO auth.users (
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role,
    aud,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    p_email::text,
    crypt(p_password::text, gen_salt('bf'))::text,
    now()::timestamptz,
    jsonb_build_object(
      'provider', 'email'::text,
      'providers', array['email']::text[]
    )::jsonb,
    jsonb_build_object('role', p_role::text)::jsonb,
    'authenticated'::text,
    'authenticated'::text,
    now()::timestamptz,
    now()::timestamptz
  )
  RETURNING id INTO v_user_id;

  -- Insert into public users table with explicit type casting
  INSERT INTO public.users (id, email, role)
  VALUES (
    v_user_id::uuid,
    p_email::text,
    p_role::text
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User created successfully'
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Email already exists'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;

-- Function to change user password (admin only)
CREATE OR REPLACE FUNCTION change_user_password(
  user_id uuid,
  new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.email = auth.jwt() ->> 'email' 
    AND auth.users.email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate password
  IF new_password IS NULL OR length(new_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters';
  END IF;

  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Update password with explicit type casting
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password::text, gen_salt('bf'))::text,
    updated_at = now()::timestamptz
  WHERE id = user_id::uuid;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Password updated successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;