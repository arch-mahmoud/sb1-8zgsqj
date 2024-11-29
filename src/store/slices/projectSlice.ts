import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Project, Task } from '../../types';

export interface ProjectSlice {
  projects: Project[];
  addProject: (projectData: Pick<Project, 'title' | 'description' | 'clientId'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  checkProjectCompletion: (projectId: string) => void;
  deleteProject: (id: string) => void;
}

export const createProjectSlice: StateCreator<ProjectSlice> = (set, get) => ({
  projects: [],

  addProject: (projectData) => {
    const newProject = {
      id: uuidv4(),
      ...projectData,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      clientId: projectData.clientId,
    };
    set((state: any) => ({
      projects: [...state.projects, newProject],
      clients: state.clients.map((client: any) => 
        client.id === projectData.clientId
          ? { ...client, projects: [...client.projects, newProject.id] }
          : client
      )
    }));
    return newProject;
  },

  checkProjectCompletion: (projectId) => {
    const { projects } = get();
    const { tasks } = get() as any;
    
    const projectTasks = tasks.filter((t: any) => t.projectId === projectId);
    if (projectTasks.length === 0) return;
    
    const completedTasks = projectTasks.filter((t: any) => t.status === 'completed');
    const progress = (completedTasks.length / projectTasks.length) * 100;
    
    if (progress === 100) {
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === projectId
            ? { ...project, status: 'completed', updatedAt: new Date() }
            : project
        )
      }));
    }
  },

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updates, updatedAt: new Date() } : project
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id)
  })),
});