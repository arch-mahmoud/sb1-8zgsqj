import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../types';
import { initialUsers } from '../../data/initialUsers';

export interface UserSlice {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  users: initialUsers,
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  addUser: (userData) => set((state) => ({
    users: [...state.users, { ...userData, id: uuidv4() }]
  })),

  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ),
    currentUser: state.currentUser?.id === id 
      ? { ...state.currentUser, ...updates }
      : state.currentUser
  })),

  deleteUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id),
    currentUser: state.currentUser?.id === id ? null : state.currentUser
  })),
});