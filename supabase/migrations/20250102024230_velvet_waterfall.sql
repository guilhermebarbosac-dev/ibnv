/*
  # Fix Password Change Function

  1. Updates
    - Improve error handling in change_user_password function
    - Add better validation and type casting
    - Add proper transaction handling
*/

-- Drop existing function
DROP FUNCTION IF EXISTS change_user_password(uuid, text);

-- Recreate function with better error handling
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
  v_encrypted_password text;
BEGIN
  -- Start transaction
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

    -- Get user email
    SELECT email INTO v_user_email
    FROM auth.users
    WHERE id = user_id;

    IF v_user_email IS NULL THEN
      RAISE EXCEPTION 'User not found';
    END IF;

    -- Generate encrypted password
    v_encrypted_password := crypt(new_password::text, gen_salt('bf'));

    -- Update password
    UPDATE auth.users
    SET 
      encrypted_password = v_encrypted_password,
      updated_at = now(),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object('password_changed_at', extract(epoch from now()))
    WHERE id = user_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Failed to update password';
    END IF;

    -- Return success
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Password updated successfully'
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      RAISE EXCEPTION '%', SQLERRM;
  END;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;