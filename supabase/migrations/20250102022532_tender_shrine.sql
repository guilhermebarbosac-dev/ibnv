/*
  # Fix User Management System

  1. Changes
    - Add proper error handling for user creation
    - Fix type casting issues
    - Add better validation
    - Improve security checks
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS create_user(text, text, text);
DROP FUNCTION IF EXISTS get_users();
DROP FUNCTION IF EXISTS delete_user(uuid);

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
    WHERE email = auth.jwt() ->> 'email' 
    AND email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    COALESCE(u.role, 'user'),
    COALESCE(u.created_at, au.created_at)
  FROM auth.users au
  LEFT JOIN public.users u ON au.id = u.id
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
    WHERE email = auth.jwt() ->> 'email' 
    AND email = 'pastor@ibnv.com.br'
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
    RAISE EXCEPTION 'Invalid role. Must be one of: user, admin, media';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;

  -- Create user in auth schema
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
    '00000000-0000-0000-0000-000000000000',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object('role', p_role),
    'authenticated',
    'authenticated',
    now(),
    now()
  )
  RETURNING id INTO v_user_id;

  -- Insert into public users table
  INSERT INTO public.users (id, email, role)
  VALUES (v_user_id, p_email, p_role);

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User created successfully',
    'user_id', v_user_id
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

-- Function to delete user (admin only)
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_email text;
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = auth.jwt() ->> 'email' 
    AND email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Get user email
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = user_id;

  IF v_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Prevent deleting admin user
  IF v_user_email = 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Cannot delete admin user';
  END IF;

  -- Delete from auth.users (cascades to public.users)
  DELETE FROM auth.users
  WHERE id = user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;