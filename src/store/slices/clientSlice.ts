import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../../types';
import { initialClients } from '../../data/initialClients';

export interface ClientSlice {
  clients: Client[];
  addClient: (clientData: Omit<Client, 'id' | 'projects' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  assignProjectToClient: (clientId: string, projectId: string) => void;
  removeProjectFromClient: (clientId: string, projectId: string) => void;
}

export const createClientSlice: StateCreator<ClientSlice> = (set) => ({
  clients: initialClients,

  addClient: (clientData) => set((state) => ({
    clients: [...state.clients, {
      id: uuidv4(),
      ...clientData,
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  })),

  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map(client =>
      client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client
    )
  })),

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter(client => client.id !== id)
  })),

  assignProjectToClient: (clientId, projectId) => set((state) => ({
    clients: state.clients.map(client =>
      client.id === clientId && !client.projects.includes(projectId)
        ? { ...client, projects: [...client.projects, projectId], updatedAt: new Date() }
        : client
    )
  })),

  removeProjectFromClient: (clientId, projectId) => set((state) => ({
    clients: state.clients.map(client =>
      client.id === clientId
        ? { ...client, projects: client.projects.filter(id => id !== projectId), updatedAt: new Date() }
        : client
    )
  })),
});