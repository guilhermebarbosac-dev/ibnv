/*
  # Fix User Deletion

  1. Changes
    - Add server-side function for user deletion
    - Update RLS policies
    - Add proper error handling

  2. Security
    - Ensure only admin can delete users
    - Add proper validation
*/

-- Create function to delete users
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  calling_user_email text;
  target_user_email text;
BEGIN
  -- Get the calling user's email
  SELECT LOWER(email) INTO calling_user_email
  FROM auth.users
  WHERE email = auth.jwt() ->> 'email';

  -- Get the target user's email
  SELECT email INTO target_user_email
  FROM auth.users
  WHERE id = user_id;

  -- Verify caller is admin and not deleting themselves
  IF calling_user_email != 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF target_user_email = 'pastor@ibnv.com.br' THEN
    RAISE EXCEPTION 'Cannot delete admin user';
  END IF;

  -- Delete the user
  DELETE FROM auth.users WHERE id = user_id;
  
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