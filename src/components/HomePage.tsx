import React from 'react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import { Building2, Users, FolderOpen, CheckCircle2, Clock, AlertTriangle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmployeeProgressCircles } from './EmployeeProgressCircles';
import { CombinedPerformanceChart } from './CombinedPerformanceChart';
import { EmployeeManagement } from './EmployeeManagement';
import { ProjectTemplates } from './ProjectTemplates';
import { ProjectForm } from './ProjectForm';

interface Props {
  onEmployeeSelect: (employee: User) => void;
}

export const HomePage: React.FC<Props> = ({ onEmployeeSelect }) => {
  const { projects, clients, users, tasks, currentUser } = useStore();
  const employees = users.filter(u => u.role === 'employee');

  const filteredTasks = currentUser?.role === 'employee'
    ? tasks.filter(task => task.assignedTo.includes(currentUser.id))
    : tasks;

  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalClients: clients.length,
    facilityClients: clients.filter(c => c.type === 'facility').length,
    individualClients: clients.filter(c => c.type === 'individual').length,
    totalEmployees: users.filter(u => u.role === 'employee').length,
    tasks: {
      total: filteredTasks.length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
      inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
      overdue: filteredTasks.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        return new Date(t.dueDate) < new Date();
      }).length
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">لوحة المعلومات</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">المشاريع</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">نشط</span>
              <span className="text-blue-600 font-medium">{stats.activeProjects}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">مكتمل</span>
              <span className="text-green-600 font-medium">{stats.completedProjects}</span>
            </div>
          </div>
        </motion.div>

        {/* Clients Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">العملاء</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">منشآت</span>
              <span className="text-purple-600 font-medium">{stats.facilityClients}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">أفراد</span>
              <span className="text-indigo-600 font-medium">{stats.individualClients}</span>
            </div>
          </div>
        </motion.div>

        {/* Employees Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">الموظفين</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalEmployees}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              متوسط المهام المكتملة:{' '}
              <span className="font-medium">
                {Math.round(completedTasks / stats.totalEmployees)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tasks Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">المهام</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.tasks.total}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">مكتملة</span>
              <span className="text-green-600 font-medium">{stats.tasks.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">قيد التنفيذ</span>
              <span className="text-blue-600 font-medium">{stats.tasks.inProgress}</span>
            </div>
            {stats.tasks.overdue > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{stats.tasks.overdue} مهام متأخرة</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Employee Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <EmployeeProgressCircles
            key={employee.id}
            employee={employee}
            onSelect={onEmployeeSelect}
          />
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart2 className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">إحصائيات الأداء</h3>
        </div>
        <CombinedPerformanceChart
          employees={employees}
          tasks={filteredTasks}
          period="month"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">النشاط الأخير</h3>
        <div className="space-y-6">
          {filteredTasks
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              const assignedUsers = users.filter(u => task.assignedTo.includes(u.id));

              return (
                <div key={task.id} className="flex items-start gap-4">
                  <div className={clsx(
                    "p-2 rounded-lg",
                    task.status === 'completed' ? "bg-green-100" :
                    task.status === 'in-progress' ? "bg-blue-100" :
                    "bg-gray-100"
                  )}>
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {project?.title} • {assignedUsers.map(u => u.name).join('، ')}
                    </p>
                    {task.dueDate && (
                      <p className={clsx(
                        "text-sm mt-1",
                        new Date(task.dueDate) < new Date() && task.status !== 'completed'
                          ? "text-red-600"
                          : "text-gray-500"
                      )}>
                        تاريخ التسليم: {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                      </p>
                    )}
                  </div>
                  <div className="mr-auto text-sm text-gray-500">
                    {new Date(task.updatedAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      
      {/* Employee Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <EmployeeManagement onEmployeeSelect={onEmployeeSelect} />
        </div>
      </div>

      {/* Project Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <ProjectTemplates />
        </div>
      </div>

      {/* Add New Project */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#1B2A4E] mb-6">
            إضافة مشروع جديد
          </h2>
          <ProjectForm />
        </div>
      </div>
    </div>
  );
};