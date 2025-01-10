-- Drop existing function
DROP FUNCTION IF EXISTS change_user_password(uuid, text);

-- Create improved password change function
CREATE OR REPLACE FUNCTION change_user_password(
  user_id uuid,
  new_password text
)
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
    WHERE auth.users.email = auth.jwt() ->> 'email' 
    AND auth.users.email = 'pastor@ibnv.com.br'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate password format (should be bcrypt hash)
  IF NOT new_password ~ '^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$' THEN
    RAISE EXCEPTION 'Invalid password format';
  END IF;

  -- Get user email
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = user_id;

  IF v_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Update password
  UPDATE auth.users
  SET 
    encrypted_password = new_password,
    updated_at = now(),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'password_changed_at', extract(epoch from now()),
        'password_changed_by', auth.jwt() ->> 'email'
      )
  WHERE id = user_id;

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