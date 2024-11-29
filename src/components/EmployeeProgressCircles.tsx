import React from 'react';
import { useStore } from '../store/useStore';
import { User } from '../types';
import { CheckCircle2, Clock, AlertTriangle, PauseCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  employee: User;
  onSelect?: (employee: User) => void;
}

export const EmployeeProgressCircles: React.FC<Props> = ({ employee, onSelect }) => {
  const { tasks } = useStore();

  const employeeTasks = tasks.filter(task => task.assignedTo.includes(employee.id));
  
  const stats = {
    completed: employeeTasks.filter(t => t.status === 'completed').length,
    inProgress: employeeTasks.filter(t => t.status === 'in-progress').length,
    paused: employeeTasks.filter(t => t.status === 'paused').length,
    overdue: employeeTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  const getProgressColor = (value: number, total: number) => {
    const percentage = (value / total) * 100;
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 50) return 'text-blue-500';
    if (percentage >= 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  const total = employeeTasks.length || 1; // Prevent division by zero

  return (
    <div 
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
        onSelect && "cursor-pointer hover:border-blue-300 transition-colors duration-200"
      )}
      onClick={() => onSelect?.(employee)}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-lg">
            {employee.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Completed Tasks Circle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg className="w-20 h-20">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className={getProgressColor(stats.completed, total)}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - stats.completed / total)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">مكتملة</span>
          <span className="text-lg font-semibold text-gray-900">{stats.completed}</span>
        </div>

        {/* In Progress Tasks Circle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg className="w-20 h-20">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className={getProgressColor(stats.inProgress, total)}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - stats.inProgress / total)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">قيد التنفيذ</span>
          <span className="text-lg font-semibold text-gray-900">{stats.inProgress}</span>
        </div>

        {/* Paused Tasks Circle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg className="w-20 h-20">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className={getProgressColor(stats.paused, total)}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - stats.paused / total)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <PauseCircle className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">متوقفة</span>
          <span className="text-lg font-semibold text-gray-900">{stats.paused}</span>
        </div>

        {/* Overdue Tasks Circle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg className="w-20 h-20">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
              />
              <circle
                className={getProgressColor(stats.overdue, total)}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - stats.overdue / total)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="30"
                cx="40"
                cy="40"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600">متأخرة</span>
          <span className="text-lg font-semibold text-gray-900">{stats.overdue}</span>
        </div>
      </div>
    </div>
  );
};