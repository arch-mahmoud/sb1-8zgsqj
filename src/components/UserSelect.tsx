import React from 'react';
import { useStore } from '../store/useStore';
import { UserCircle2 } from 'lucide-react';

export const UserSelect: React.FC = () => {
  const { users, currentUser, setCurrentUser } = useStore();

  return (
    <div className="flex items-center gap-2">
      <UserCircle2 className="w-5 h-5 text-gray-500" />
      <select
        value={currentUser?.id || ''}
        onChange={(e) => {
          const user = users.find((u) => u.id === e.target.value);
          if (user) setCurrentUser(user);
        }}
        className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
      >
        <option value="">اختر مستخدم</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role === 'manager' ? 'مدير' : 'موظف'})
          </option>
        ))}
      </select>
    </div>
  );
};