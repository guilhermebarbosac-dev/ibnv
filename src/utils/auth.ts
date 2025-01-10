import { supabase } from '../lib/supabase';
import { validatePassword } from './validation';
import { hashPassword } from './crypto';

interface AuthResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Create a new user
 */
export async function createUser(email: string, password: string, role: string): Promise<AuthResult> {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Invalid email format' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message || 'Invalid password format' };
    }

    const hashedPassword = await hashPassword(password);

    // Create the user in the auth.users table
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
    });

    if (signUpError) throw signUpError;

    if (!authUser.user) {
      throw new Error('Failed to create user in auth.users');
    }

    return {
      success: true,
      message: 'User created successfully',
      data: authUser.user
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: error.message || 'Failed to create user'
    };
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(userId: string, newPassword: string): Promise<AuthResult> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return { success: false, message: 'User not authenticated' };
    }

    if (currentUser.user.email !== 'pastor@ibnv.com.br' && currentUser.user.id !== userId) {
      return { success: false, message: 'Unauthorized to change password' };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message || 'Invalid password format' };
    }

    const hashedPassword = await hashPassword(newPassword);

    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: hashedPassword }
    );

    if (error) throw error;

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error: any) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: error.message || 'Failed to change password'
    };
  }
}