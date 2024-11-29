import { create } from 'zustand';
import { UserSlice, createUserSlice } from './slices/userSlice';
import { ProjectSlice, createProjectSlice } from './slices/projectSlice';
import { TaskSlice, createTaskSlice } from './slices/taskSlice';
import { TemplateSlice, createTemplateSlice } from './slices/templateSlice';
import { NotificationSlice, createNotificationSlice } from './slices/notificationSlice';
import { SettingsSlice, createSettingsSlice } from './slices/settingsSlice';
import { ClientSlice, createClientSlice } from './slices/clientSlice';
import { InvoiceSlice, createInvoiceSlice } from './slices/invoiceSlice';
import { SupplierSlice, createSupplierSlice } from './slices/supplierSlice';

updateClientData: (updatedClient) =>
  set((state) => ({
    clients: state.clients.map(client =>
      client.id === updatedClient.id ? updatedClient : client
    
      
export type StoreState = UserSlice & 
  ProjectSlice & 
  TaskSlice & 
  TemplateSlice & 
  NotificationSlice & 
  SettingsSlice &
  ClientSlice &
  InvoiceSlice &
  SupplierSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createProjectSlice(...a),
  ...createTaskSlice(...a),
  ...createTemplateSlice(...a),
  ...createNotificationSlice(...a),
  ...createSettingsSlice(...a),
  ...createClientSlice(...a),
  ...createInvoiceSlice(...a),
  ...createSupplierSlice(...a),
}));