-- Create users table to track user data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by admin"
ON users FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

CREATE POLICY "Admin can manage users"
ON users FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'pastor@ibnv.com.br');

-- Insert initial admin user if not exists
INSERT INTO users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users 
WHERE email = 'pastor@ibnv.com.br'
ON CONFLICT (id) DO NOTHING;