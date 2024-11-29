import React from 'react';
import { useStore } from '../store/useStore';
import { TaskAttachments } from './TaskAttachments';
import { Lock, CheckCircle2, Clock, PauseCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface Props {
  projectId: string;
  tasks: Task[]; // These tasks are already filtered by the parent component
}

export const TaskList: React.FC<Props> = ({ projectId, tasks }) => {
  const { currentUser, users, updateTask } = useStore();

  const canUpdateTask = (task: typeof tasks[0]) => {
    return currentUser?.role === 'manager' || 
           (currentUser && task.assignedTo.includes(currentUser.id));
  };

  const isTaskLocked = (task: typeof tasks[0]) => {
    if (!task.dependsOn?.length) return false;
    return task.dependsOn.some(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && depTask.status !== 'completed';
    });
  };

  const getDependentTaskInfo = (task: typeof tasks[0]) => {
    if (!task.dependsOn?.length) return null;
    // Only show dependency info for tasks the employee can see
    const dependentTasks = task.dependsOn.map(depId => 
      tasks.find(t => t.id === depId && 
        (currentUser?.role === 'manager' || t.assignedTo.includes(currentUser?.id || '')))
    );
    const incompleteTasks = dependentTasks.filter(t => t && t.status !== 'completed');
    if (!incompleteTasks.length) return null;

    return incompleteTasks.map(t => ({
      title: t?.title,
      assignedTo: t?.assignedTo.map(userId => 
        users.find(u => u.id === userId)?.name
      ).filter(Boolean).join('، ')
    }));
  };

  const handleStatusChange = (taskId: string, status: typeof tasks[0]['status'], reason?: string) => {
    updateTask(taskId, { 
      status,
      ...(reason && { pauseReason: reason }),
      ...(status === 'paused' && { pausedAt: new Date(), pausedBy: currentUser?.id }),
    });
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => {
          const isLocked = isTaskLocked(task);
          const dependentInfo = getDependentTaskInfo(task);
          const canEdit = canUpdateTask(task);
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={clsx(
                "p-4 rounded-lg border transition-all duration-200",
                isLocked ? "bg-gray-50 border-gray-200" :
                task.status === 'completed' ? "bg-green-50 border-green-200" :
                task.status === 'in-progress' ? "bg-blue-50 border-blue-200" :
                task.status === 'paused' ? "bg-amber-50 border-amber-200" :
                "bg-white border-gray-200"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    {isLocked && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  
                  {dependentInfo && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>معلقة حتى اكتمال:</p>
                      <ul className="list-disc list-inside">
                        {dependentInfo.map((dep, index) => (
                          <li key={index}>
                            {dep.title} (المسؤول: {dep.assignedTo})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.status === 'paused' && task.pauseReason && (
                    <div className="mt-2 text-sm text-amber-600">
                      سبب التوقف: {task.pauseReason}
                    </div>
                  )}

                  {task.dueDate && (
                    <div className="mt-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={clsx(
                        "text-sm",
                        isOverdue ? "text-red-600" : "text-gray-500"
                      )}>
                        تاريخ التسليم: {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 text-sm text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          متأخرة
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <TaskAttachments 
                      task={task} 
                      canEdit={canEdit} 
                    />
                  </div>
                </div>

                {canEdit && !isLocked && (
                  <div className="flex items-center gap-2">
                    {currentUser?.role === 'manager' && task.status === 'completed' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        className="text-amber-600 hover:text-amber-700"
                        title="إرجاع المهمة"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="text-green-600 hover:text-green-700"
                        title="اكتمال المهمة"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    
                    {task.status !== 'in-progress' && task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        className="text-blue-600 hover:text-blue-700"
                        title="بدء العمل"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    )}

                    {task.status !== 'paused' && task.status !== 'completed' && (
                      <button
                        onClick={() => {
                          const reason = prompt('سبب إيقاف المهمة:');
                          if (reason) {
                            handleStatusChange(task.id, 'paused', reason);
                          }
                        }}
                        className="text-amber-600 hover:text-amber-700"
                        title="إيقاف مؤقت"
                      >
                        <PauseCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد مهام في هذا المشروع</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;