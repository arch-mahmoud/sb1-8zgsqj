import { StateCreator } from 'zustand';
import { Notification } from '../../types';

export interface NotificationSlice {
  notifications: Notification[];
  getUnreadNotifications: (userId: string) => Notification[];
  markNotificationAsRead: (notificationId: string) => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (set, get) => ({
  notifications: [],

  getUnreadNotifications: (userId) => {
    const { notifications } = get();
    return notifications.filter(n => n.userId === userId && !n.read);
  },

  markNotificationAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    )
  })),
});