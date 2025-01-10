/*
  # Fix User Management Functions

  1. Changes
    - Fix user creation function to handle errors better
    - Add proper role validation
    - Improve error messages
    - Add proper type casting
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS create_user(text, text, text);
DROP FUNCTION IF EXISTS get_users();
DROP FUNCTION IF EXISTS delete_user(uuid);

-- Create function to get all users (admin only)
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
  v_encrypted_pw text;
BEGIN
  -- Verify caller is admin
  IF (auth.jwt() ->> 'email') != 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate email
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  -- Validate password
  IF p_password IS NULL OR length(p_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters';
  END IF;

  -- Validate role
  IF p_role NOT IN ('user', 'admin', 'media') THEN
    RAISE EXCEPTION 'Invalid role. Must be one of: user, admin, media';
  END IF;

  -- Generate encrypted password
  v_encrypted_pw := crypt(p_password, gen_salt('bf'));

  -- Create user in auth.users
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
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    p_email,
    v_encrypted_pw,
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('role', p_role),
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO v_user_id;

  -- Insert into public.users (trigger will handle this)
  INSERT INTO public.users (id, email, role)
  VALUES (v_user_id, p_email, p_role)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      role = EXCLUDED.role;

  RETURN json_build_object(
    'success', true,
    'message', 'User created successfully',
    'user_id', v_user_id
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
  IF (auth.jwt() ->> 'email') != 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Get user email
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = user_id;

  -- Prevent deleting admin user
  IF v_user_email = 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Cannot delete admin user';
  END IF;

  -- Delete from auth.users (will cascade to public.users)
  DELETE FROM auth.users
  WHERE id = user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'User deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;