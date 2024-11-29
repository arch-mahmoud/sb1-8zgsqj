import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  BarChart3,
  ListTodo,
  Calendar
} from 'lucide-react';

export const EmployeeStats: React.FC = () => {
  const { tasks, currentUser } = useStore();
  
  const stats = useMemo(() => {
    if (!currentUser) return null;

    const userTasks = tasks.filter(task => 
      task.assignedTo.includes(currentUser.id)
    );

    const completedTasks = userTasks.filter(t => t.status === 'completed');
    const inProgressTasks = userTasks.filter(t => t.status === 'in-progress');
    const pendingTasks = userTasks.filter(t => t.status === 'pending');
    
    const overdueTasks = userTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    });

    const upcomingTasks = userTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      return dueDate > today && dueDate <= threeDaysFromNow;
    });

    const completionRate = userTasks.length > 0
      ? (completedTasks.length / userTasks.length) * 100
      : 0;

    return {
      total: userTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      pending: pendingTasks.length,
      overdue: overdueTasks.length,
      upcoming: upcomingTasks.length,
      completionRate,
    };
  }, [tasks, currentUser]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ListTodo className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">إجمالي المهام</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">قيد التنفيذ</span>
            <span className="text-blue-600 font-medium">{stats.inProgress}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">مكتملة</span>
            <span className="text-green-600 font-medium">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">نسبة الإنجاز</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(stats.completionRate)}%
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upcoming & Overdue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Calendar className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">المهام القادمة</h3>
            <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
          </div>
        </div>
        <div className="mt-4">
          {stats.overdue > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{stats.overdue} مهام متأخرة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};