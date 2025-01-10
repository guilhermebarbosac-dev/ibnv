-- Drop existing functions
DROP FUNCTION IF EXISTS create_user(text, text, text);
DROP FUNCTION IF EXISTS get_users();

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

  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    COALESCE(u.role, 'user'),
    COALESCE(u.created_at, au.created_at)
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
    updated_at,
    confirmation_token,
    recovery_token
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
    now(),
    '',
    ''
  )
  RETURNING id INTO v_user_id;

  -- Insert into public users table
  INSERT INTO public.users (id, email, role)
  VALUES (v_user_id, p_email, p_role);

  -- Return success with user ID
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
    -- Log the error details
    RAISE NOTICE 'Error creating user: %', SQLERRM;
    
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;

-- Create trigger to sync user data
CREATE OR REPLACE FUNCTION sync_user_data()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.users (id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      email = EXCLUDED.email,
      role = EXCLUDED.role;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.users
    SET
      email = NEW.email,
      role = COALESCE(NEW.raw_user_meta_data->>'role', users.role)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_data();