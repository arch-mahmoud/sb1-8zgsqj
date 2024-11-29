import React from 'react';
import { Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onNotificationsClick: () => void;
}

export const NotificationBell: React.FC<Props> = ({ onNotificationsClick }) => {
  const { currentUser, getUnreadNotifications } = useStore();

  if (!currentUser) return null;

  const notifications = getUnreadNotifications(currentUser.id);
  const hasUnread = notifications.length > 0;

  return (
    <button
      onClick={onNotificationsClick}
      className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Bell className="w-6 h-6 text-gray-600" />
      <AnimatePresence>
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 flex items-center justify-center"
          >
            <span className="flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full min-w-[1.25rem] h-5 px-1">
              {notifications.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};