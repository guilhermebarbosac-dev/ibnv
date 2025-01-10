/*
  # Fix type mismatch in get_users function

  1. Changes
    - Fix type casting for role column
    - Ensure consistent type handling
    - Improve error handling
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_users();

-- Recreate get_users function with proper type handling
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
    CAST(COALESCE(u.role, 'user') AS text),
    COALESCE(u.created_at, au.created_at)
  FROM auth.users au
  LEFT JOIN public.users u ON u.id = au.id
  ORDER BY COALESCE(u.created_at, au.created_at) DESC;
END;
$$;