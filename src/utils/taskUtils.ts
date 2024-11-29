import { Task } from '../types';

export const isTaskLocked = (task: Task, allTasks: Task[]) => {
  if (!task.dependsOn?.length) return false;
  return task.dependsOn.some(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return depTask && depTask.status !== 'completed';
  });
};

export const getTaskStatus = (task: Task) => {
  switch (task.status) {
    case 'completed':
      return { text: 'مكتملة', color: 'text-green-600' };
    case 'in-progress':
      return { text: 'قيد التنفيذ', color: 'text-blue-600' };
    case 'paused':
      return { text: 'متوقفة', color: 'text-amber-600' };
    default:
      return { text: 'معلقة', color: 'text-gray-600' };
  }
};

export const calculateTaskProgress = (tasks: Task[]) => {
  const total = tasks.length;
  if (total === 0) return 0;
  
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / total) * 100);
};