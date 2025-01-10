import bcrypt from 'bcryptjs';

/**
 * Hash password using bcrypt to match Supabase's auth format
 * Format: $2a$[cost]$[22 character salt][31 character hash]
 */
export async function hashPassword(password: string): Promise<string> {
  // Use cost factor 10 to match Supabase's default
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Verify if a password matches a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}