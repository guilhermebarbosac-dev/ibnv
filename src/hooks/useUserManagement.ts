import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createUser, changeUserPassword } from '../utils/auth';
import { useToast } from './useToast';

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, created_at');
      
      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users');
      showToast(error.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleCreateUser = async (email: string, password: string, role: string) => {
    const result = await createUser(email, password, role);
    
    if (result.success) {
      await fetchUsers();
      showToast('User created successfully', 'success');
    } else {
      showToast(result.message, 'error');
    }
    
    return result;
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (dbError) throw dbError;

      await fetchUsers();
      showToast('User deleted successfully', 'success');
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showToast(error.message || 'Failed to delete user', 'error');
      return {
        success: false,
        error: error.message || 'Failed to delete user'
      };
    }
  };

  const handleChangePassword = async (userId: string, newPassword: string) => {
    const result = await changeUserPassword(userId, newPassword);
    
    if (result.success) {
      showToast('Password changed successfully', 'success');
    } else {
      showToast(result.message, 'error');
    }
    
    return result;
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { 
    users, 
    loading, 
    error, 
    createUser: handleCreateUser, 
    deleteUser, 
    changePassword: handleChangePassword, 
    fetchUsers 
  };
}