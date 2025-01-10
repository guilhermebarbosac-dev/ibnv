/*
  # Fix get_users function

  1. Changes
    - Fix ambiguous column references
    - Improve column selection clarity
    - Add proper table aliases
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_users();

-- Recreate get_users function with proper column references
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
    COALESCE(u.role, 'user'::text),
    COALESCE(u.created_at, au.created_at)
  FROM auth.users au
  LEFT JOIN public.users u ON u.id = au.id
  ORDER BY COALESCE(u.created_at, au.created_at) DESC;
END;
$$;