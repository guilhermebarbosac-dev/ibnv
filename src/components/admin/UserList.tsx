import { useState } from 'react';
import { DeleteButton } from './DeleteButton';
import { User } from '../../hooks/useUserManagement';
import { ChangePasswordModal } from './ChangePasswordModal';
import { Key } from 'lucide-react';

interface UserListProps {
  users: User[];
  onDelete: (userId: string) => Promise<void>;
  onChangePassword: (userId: string, newPassword: string) => Promise<void>;
}

export function UserList({ users, onDelete, onChangePassword }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">Função: {user.role}</p>
              <p className="text-xs text-gray-400">
                Criado em: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedUser(user)}
                className="p-2 text-secondary hover:text-secondary/80 transition-colors"
                title="Alterar senha"
              >
                <Key className="w-5 h-5" />
              </button>
              {user.email !== 'pastor@ibnv.com.br' && (
                <DeleteButton onDelete={() => onDelete(user.id)} itemName="usuário" />
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <ChangePasswordModal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          onConfirm={async (newPassword) => {
            await onChangePassword(selectedUser.id, newPassword);
          }}
          userEmail={selectedUser.email}
        />
      )}
    </>
  );
}