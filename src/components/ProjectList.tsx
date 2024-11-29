import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { ProjectEditForm } from './ProjectEditForm';
import { ProjectGanttChart } from './ProjectGanttChart';
import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Search,
  BarChart2,
  AlertTriangle,
  Edit2,
  Building2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const ProjectList: React.FC = () => {
  const { projects, tasks, currentUser, users, updateProject } = useStore();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [showGantt, setShowGantt] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const getProjectTasks = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    return currentUser?.role === 'employee'
      ? projectTasks.filter(task => 
          task.assignedTo.includes(currentUser.id) || 
          task.status === 'completed'
        )
      : projectTasks;
  };

  const getProjectStats = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;

    const assignedUsers = new Set(projectTasks.flatMap(task => task.assignedTo));

    const overdueTasks = projectTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    });

    return {
      total: projectTasks.length,
      completed: completedTasks,
      inProgress: projectTasks.filter(t => t.status === 'in-progress').length,
      assignedUsers: assignedUsers.size,
      overdue: overdueTasks.length
    };
  };

  const getProjectProgress = (projectId: string) => {
    const stats = getProjectStats(projectId);
    return stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  };

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(project => 
        filter === 'completed' ? project.status === 'completed' : 
        filter === 'overdue' ? getProjectStats(project.id).overdue > 0 :
        project.status === 'active'
      );
    }

    // For employees, only show projects they're assigned to
    if (currentUser?.role === 'employee') {
      filtered = filtered.filter(project =>
        tasks.some(task => 
          task.projectId === project.id && 
          task.assignedTo.includes(currentUser.id)
        )
      );
    }

    return filtered;
  }, [projects, searchTerm, filter, currentUser, tasks]);

  // Check project completion when tasks change
  React.useEffect(() => {
    projects.forEach(project => {
      const stats = getProjectStats(project.id);
      if (stats.total > 0 && stats.completed === stats.total && project.status !== 'completed') {
        updateProject(project.id, { status: 'completed' });
      }
    });
  }, [tasks, projects, updateProject]);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المشاريع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                الكل
              </div>
            </button>
            <button
              onClick={() => setFilter('active')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                نشط
              </div>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                مكتمل
              </div>
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'overdue'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                متأخر
              </div>
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <span>إجمالي المشاريع: {filteredProjects.length}</span>
            <span>مكتملة: {filteredProjects.filter(p => p.status === 'completed').length}</span>
            <span>نشطة: {filteredProjects.filter(p => p.status === 'active').length}</span>
          </div>
          {searchTerm && (
            <span>نتائج البحث: {filteredProjects.length}</span>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="wait">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.id);
            const progress = getProjectProgress(project.id);
            const isExpanded = expandedProject === project.id;
            const isGanttVisible = showGantt === project.id;
            const isCompleted = progress === 100;
            
            return (
              <motion.div
                key={`project-${project.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={clsx(
                  "bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-lg group",
                  isCompleted
                    ? "border-green-200 hover:border-green-300"
                    : "border-gray-200 hover:border-blue-300"
                )}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={clsx(
                        "p-3 rounded-lg transition-all duration-300 group-hover:scale-110",
                        isCompleted ? 'bg-green-100' : 'bg-blue-100'
                      )}>
                        <FolderOpen className={clsx(
                          "w-6 h-6",
                          isCompleted ? 'text-green-600' : 'text-blue-600'
                        )} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-6 mt-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {stats.assignedUsers} موظف
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(project.createdAt).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowGantt(isGanttVisible ? null : project.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض مخطط جانت"
                      >
                        <BarChart2 className="w-5 h-5" />
                      </button>
                      {currentUser?.role === 'manager' && (
                        <button
                          onClick={() => setEditingProject(project.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل المشروع"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={clsx(
                                "h-full rounded-full transition-all duration-500 ease-out",
                                progress >= 75 ? 'bg-green-500' :
                                progress >= 50 ? 'bg-blue-500' :
                                progress >= 25 ? 'bg-yellow-500' :
                                'bg-red-500'
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            {stats.completed}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-blue-600">
                            <Clock className="w-4 h-4" />
                            {stats.inProgress}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isGanttVisible && (
                      <motion.div
                        key={`gantt-${project.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6"
                      >
                        <ProjectGanttChart
                          projectId={project.id}
                          tasks={tasks}
                          users={users}
                        />
                      </motion.div>
                    )}

                    {isExpanded && (
                      <motion.div
                        key={`details-${project.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 border-t pt-6"
                      >
                        {currentUser?.role === 'manager' && (
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                              إضافة مهمة جديدة
                            </h4>
                            <TaskForm project={project} />
                          </div>
                        )}
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          المهام
                        </h4>
                        <TaskList 
                          projectId={project.id}
                          tasks={getProjectTasks(project.id)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {editingProject === project.id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <ProjectEditForm
                        project={project}
                        onClose={() => setEditingProject(null)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد مشاريع متاحة</p>
          </div>
        )}
      </div>
    </div>
  );
};