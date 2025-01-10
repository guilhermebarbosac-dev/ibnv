-- Drop existing function
DROP FUNCTION IF EXISTS get_users();

-- Recreate get_users function with explicit type handling
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