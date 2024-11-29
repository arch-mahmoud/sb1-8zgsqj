import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ProjectTemplate } from '../../types';
import { initialTemplates } from '../../data/initialTemplates';
import { StoreState } from '../useStore';

export interface TemplateSlice {
  templates: ProjectTemplate[];
  addTemplate: (templateData: Pick<ProjectTemplate, 'title' | 'description' | 'tasks'>) => void;
  deleteTemplate: (id: string) => void;
  createProjectFromTemplate: (templateId: string, clientId: string) => void;
}

export const createTemplateSlice: StateCreator<
  StoreState,
  [],
  [],
  TemplateSlice
> = (set, get) => ({
  templates: initialTemplates,

  addTemplate: (templateData) => set((state) => ({
    templates: [...state.templates, {
      id: uuidv4(),
      ...templateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  })),

  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(template => template.id !== id)
  })),

  createProjectFromTemplate: (templateId, clientId) => {
    const { templates, addProject, addTask } = get();
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const project = addProject({
      title: template.title,
      clientId,
      description: template.description,
      clientId,
    });

    const taskIdMap = new Map<number, string>();

    template.tasks.forEach((taskTemplate, index) => {
      const newTaskId = uuidv4();
      taskIdMap.set(index, newTaskId);

      const dependsOn = taskTemplate.dependsOn
        .map(depIndex => taskIdMap.get(parseInt(depIndex)))
        .filter(Boolean) as string[];

      addTask({
        id: newTaskId,
        projectId: project.id,
        title: taskTemplate.title,
        description: taskTemplate.description,
        assignedTo: taskTemplate.assignedTo,
        dependsOn,
        dueDate: taskTemplate.estimatedDuration
          ? new Date(Date.now() + taskTemplate.estimatedDuration * 24 * 60 * 60 * 1000)
          : undefined,
      });
    });
  },
});