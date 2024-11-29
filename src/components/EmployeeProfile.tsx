import React, { useMemo, useState } from 'react';
import { User } from '../types';
import { useStore } from '../store/useStore';
import { EmployeePerformanceChart } from './EmployeePerformanceChart';
import { EmployeeReport } from './EmployeeReport';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { 
  Calendar,
  Mail,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PauseCircle,
  ArrowLeft,
  BarChart2,
  ListTodo,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Props {
  employee: User;
  onBack: () => void;
}

export const EmployeeProfile: React.FC<Props> = ({ employee, onBack }) => {
  const { tasks, settings } = useStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const employeeTasks = useMemo(() => 
    tasks.filter(task => task.assignedTo.includes(employee.id)),
    [tasks, employee.id]
  );

  const stats = useMemo(() => ({
    total: employeeTasks.length,
    completed: employeeTasks.filter(t => t.status === 'completed').length,
    inProgress: employeeTasks.filter(t => t.status === 'in-progress').length,
    paused: employeeTasks.filter(t => t.status === 'paused').length,
    overdue: employeeTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  }), [employeeTasks]);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة للوحة التحكم
        </button>

        <PDFDownloadLink
          document={
            <EmployeeReport 
              employee={employee}
              tasks={employeeTasks}
              logo={settings.logo || ''}
            />
          }
          fileName={`تقرير-${employee.name}-${new Date().toLocaleDateString('ar-SA')}.pdf`}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            isGeneratingPDF
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          )}
          onClick={() => setIsGeneratingPDF(true)}
        >
          {({ loading }) => (
            <>
              <FileText className="w-5 h-5" />
              <span>{loading ? 'جاري إنشاء التقرير...' : 'تصدير PDF'}</span>
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-semibold text-blue-600">
              {employee.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{employee.name}</h2>
              <p className="text-gray-500">{employee.position}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{employee.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  انضم في {new Date(employee.joinDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ListTodo className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي المهام</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">نسبة الإنجاز</p>
              <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">قيد التنفيذ</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">متأخرة</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart2 className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">أداء الموظف</h3>
        </div>
        <EmployeePerformanceChart employee={employee} tasks={employeeTasks} />
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">المهام</h3>
        </div>
        <div className="space-y-4">
          {employeeTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      تاريخ التسليم: {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      مكتملة
                    </span>
                  ) : task.status === 'in-progress' ? (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-5 h-5" />
                      قيد التنفيذ
                    </span>
                  ) : task.status === 'paused' ? (
                    <span className="flex items-center gap-1 text-amber-600">
                      <PauseCircle className="w-5 h-5" />
                      متوقفة
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-5 h-5" />
                      معلقة
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};