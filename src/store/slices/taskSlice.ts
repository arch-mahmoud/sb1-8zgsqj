import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../types';
import { StoreState } from '../useStore';

export interface TaskSlice {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'attachments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTaskAttachment: (taskId: string, file: File) => Promise<void>;
  removeTaskAttachment: (taskId: string, attachmentId: string) => void;
}

export const createTaskSlice: StateCreator<
  StoreState,
  [],
  [],
  TaskSlice
> = (set, get) => ({
  tasks: [],

  addTask: (taskData) => {
    const { currentUser } = get();
    if (!currentUser) return;

    set((state) => ({
      tasks: [...state.tasks, {
        id: uuidv4(),
        ...taskData,
        status: 'pending',
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      notifications: [
        ...state.notifications,
        ...taskData.assignedTo.map(userId => ({
          id: uuidv4(),
          userId,
          taskId: taskData.id,
          type: 'assignment' as const,
          read: false,
          createdAt: new Date(),
        }))
      ]
    }));
  },

  updateTask: (id, updates) => {
    const { tasks, currentUser } = get();
    const task = tasks.find(t => t.id === id);
    
    if (!task || !currentUser) return;

    // Only managers can revert completed tasks
    if (task.status === 'completed' && updates.status === 'in-progress' && currentUser.role !== 'manager') {
      throw new Error('لا يمكن إرجاع المهمة المكتملة إلا بواسطة المدير');
    }

    const isLocked = task.dependsOn?.some(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && depTask.status !== 'completed';
    });

    if (isLocked && updates.status && updates.status !== 'pending') {
      throw new Error('لا يمكن تحديث حالة المهمة حتى اكتمال المهام المرتبطة');
    }

    const { checkProjectCompletion } = get() as any;

    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
      notifications: [
        ...state.notifications,
        {
          id: uuidv4(),
          userId: task.assignedTo[0],
          taskId: id,
          type: updates.status === 'completed' ? 'task_completed' : 
                updates.status === 'paused' ? 'task_paused' : 
                task.status === 'completed' ? 'task_reverted' : 'task_updated',
          read: false,
          createdAt: new Date(),
        }
      ]
    }));

    // Check project completion after task update
    const updatedTask = get().tasks.find(t => t.id === id);
    if (updatedTask) {
      checkProjectCompletion(updatedTask.projectId);
    }
  },

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  addTaskAttachment: async (taskId, file) => {
    const { currentUser, settings } = get();
    if (!currentUser) return;

    if (file.size > settings.maxFileSize) {
      throw new Error(`حجم الملف يجب أن لا يتجاوز ${settings.maxFileSize / (1024 * 1024)} ميجابايت`);
    }

    const reader = new FileReader();
    const attachment = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              attachments: [
                ...task.attachments,
                {
                  id: uuidv4(),
                  taskId,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  data: attachment,
                  uploadedBy: currentUser.id,
                  uploadedAt: new Date(),
                }
              ]
            }
          : task
      ),
      notifications: [
        ...state.notifications,
        {
          id: uuidv4(),
          userId: currentUser.id,
          taskId,
          type: 'attachment_added',
          read: false,
          createdAt: new Date(),
        }
      ]
    }));
  },

  removeTaskAttachment: (taskId, attachmentId) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            attachments: task.attachments.filter(att => att.id !== attachmentId)
          }
        : task
    )
  })),
});