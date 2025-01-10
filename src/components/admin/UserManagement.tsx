import { useState } from 'react';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useToastContext } from '../context/ToastContext';
import { Loader } from '../ui/Loader';
import { UserList } from './UserList';

export function UserManagement() {
  const { users, loading, error, createUser, deleteUser, changePassword } = useUserManagement();
  const { addToast } = useToastContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { success } = await createUser(email, password, role);
    
    if (success) {
      addToast('Usuário criado com sucesso!', 'success');
      setEmail('');
      setPassword('');
      setRole('user');
    } else {
      addToast(`Erro ao criar usuário: ${error}`, 'error');
    }
  }

  async function handleDelete(userId: string) {
    const { success, error } = await deleteUser(userId);
    if (success) {
      addToast('Usuário excluído com sucesso!', 'success');
    } else {
      addToast(`Erro ao excluir usuário: ${error}`, 'error');
    }
  }

  async function handleChangePassword(userId: string, newPassword: string) {
    const { success } = await changePassword(userId, newPassword);
    if (success) {
      addToast('Senha alterada com sucesso!', 'success');
    } else {
      addToast(`Erro ao alterar senha: ${error}`, 'error');
    }
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="text-md font-medium mb-4">Adicionar Usuário</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Função</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
              <option value="media">Mídia</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Criar Usuário
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-md font-medium mb-4">Usuários</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <UserList 
            users={users}
            onDelete={handleDelete}
            onChangePassword={handleChangePassword}
          />
        )}
      </div>
    </div>
  );
}