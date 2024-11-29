import React from 'react';
import { useStore } from '../store/useStore';
import { Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const NotificationsPage: React.FC = () => {
  const { currentUser, notifications, tasks, markNotificationAsRead } = useStore();

  if (!currentUser) return null;

  const userNotifications = notifications
    .filter(notif => notif.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'due_date':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">الإشعارات</h2>
            <span className="text-sm text-gray-500">
              {userNotifications.length} إشعار
            </span>
          </div>

          <div className="space-y-4">
            {userNotifications.length > 0 ? (
              userNotifications.map((notification) => {
                const task = tasks.find((t) => t.id === notification.taskId);
                if (!task) return null;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'p-4 rounded-lg border transition-all duration-200',
                      notification.read
                        ? 'bg-white border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    )}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-white border border-gray-200">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {notification.type === 'assignment'
                                ? 'تم تعيين مهمة جديدة'
                                : 'تذكير بموعد تسليم'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          {task.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              مكتملة
                            </span>
                          ) : task.status === 'in-progress' ? (
                            <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                              <Clock className="w-4 h-4" />
                              قيد التنفيذ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              معلقة
                            </span>
                          )}
                          {task.dueDate && new Date(task.dueDate) < new Date() && (
                            <span className="inline-flex items-center gap-1 text-sm text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              متأخرة
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد إشعارات</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};