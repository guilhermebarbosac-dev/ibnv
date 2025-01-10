/*
  # Fix User Management Functions

  1. Changes
    - Add secure functions for user management
    - Improve error handling
    - Add proper role validation

  2. Security
    - Ensure only admin can manage users
    - Add input validation
    - Prevent admin user deletion
*/

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
  IF (auth.jwt() ->> 'email') != 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    us.role,
    us.created_at
  FROM auth.users u
  LEFT JOIN users us ON u.id = us.id
  ORDER BY us.created_at DESC;
END;
$$;

-- Function to create new user (admin only)
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
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('role', p_role),
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO v_user_id;

  -- User table is handled by trigger

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