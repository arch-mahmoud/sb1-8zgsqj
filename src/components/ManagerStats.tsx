import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CombinedPerformanceChart } from './CombinedPerformanceChart';
import { EmployeeProgressCircles } from './EmployeeProgressCircles';
import { User } from '../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Briefcase,
  ListTodo,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

type Period = 'day' | 'week' | 'month';

interface Props {
  onEmployeeSelect: (employee: User) => void;
}

export const ManagerStats: React.FC<Props> = ({ onEmployeeSelect }) => {
  const { projects, tasks, users } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  
  const employees = users.filter(user => user.role === 'employee');
  
  const stats = {
    employeeCount: employees.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Project Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">المشاريع النشطة</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            مكتملة: {stats.completedProjects}
          </div>
        </div>

        {/* Task Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ListTodo className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">إجمالي المهام</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingTasks + stats.inProgressTasks + stats.completedTasks}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">قيد التنفيذ</span>
              <span className="text-blue-600 font-medium">{stats.inProgressTasks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">مكتملة</span>
              <span className="text-green-600 font-medium">{stats.completedTasks}</span>
            </div>
          </div>
        </div>

        {/* Employee Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">الموظفين</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.employeeCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              متوسط المهام المكتملة:{' '}
              <span className="font-medium">
                {Math.round(stats.completedTasks / stats.employeeCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">مهام متأخرة</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.overdueTasks}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              تحتاج إلى مراجعة عاجلة
            </div>
          </div>
        </div>
      </div>

      {/* Employee Progress Circles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <EmployeeProgressCircles 
            key={employee.id} 
            employee={employee} 
            onSelect={onEmployeeSelect}
          />
        ))}
      </div>

      {/* Period Selector and Combined Chart */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">إحصائيات الأداء</h3>
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as Period[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {period === 'day' ? 'اليوم' : period === 'week' ? 'الأسبوع' : 'الشهر'}
              </button>
            ))}
          </div>
        </div>

        <CombinedPerformanceChart
          employees={employees}
          tasks={tasks}
          period={selectedPeriod}
        />
      </div>
    </div>
  );
};