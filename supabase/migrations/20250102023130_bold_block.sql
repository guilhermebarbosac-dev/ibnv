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
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.email = auth.jwt() ->> 'email' 
    AND auth.users.email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Use CTE for cleaner query and explicit type handling
  RETURN QUERY
  WITH user_data AS (
    SELECT 
      au.id,
      au.email,
      COALESCE(u.role, 'user') as role,
      COALESCE(u.created_at, au.created_at) as created_at
    FROM auth.users au
    LEFT JOIN public.users u ON u.id = au.id
  )
  SELECT 
    ud.id::uuid,
    ud.email::text,
    ud.role::text,
    ud.created_at::timestamptz
  FROM user_data ud
  ORDER BY ud.created_at DESC;
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
    RAISE EXCEPTION 'Invalid role. Must be one of: user, admin, media';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;

  -- Create user in auth schema with explicit type handling
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