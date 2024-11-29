import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Supplier } from '../../types';
import { initialSuppliers } from '../../data/initialSuppliers';

export interface SupplierSlice {
  suppliers: Supplier[];
  addSupplier: (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'balance'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  getSupplierBalance: (id: string) => { totalExpenses: number; totalPaid: number; balance: number };
}

export const createSupplierSlice: StateCreator<SupplierSlice> = (set, get) => ({
  suppliers: initialSuppliers,

  addSupplier: (supplierData) => set((state) => ({
    suppliers: [...state.suppliers, {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      balance: 0,
      ...supplierData,
    }]
  })),

  updateSupplier: (id, updates) => set((state) => ({
    suppliers: state.suppliers.map(supplier =>
      supplier.id === id ? { ...supplier, ...updates, updatedAt: new Date() } : supplier
    )
  })),

  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter(supplier => supplier.id !== id)
  })),

  getSupplierBalance: (id) => {
    const { receipts } = get() as any;
    const supplierReceipts = receipts.filter((r: any) => r.supplierId === id);
    
    const totalExpenses = supplierReceipts
      .filter((r: any) => r.type === 'expense')
      .reduce((sum: number, r: any) => sum + r.amount, 0);
    
    const totalPaid = supplierReceipts
      .filter((r: any) => r.type === 'payment')
      .reduce((sum: number, r: any) => sum + r.amount, 0);

    return {
      totalExpenses,
      totalPaid,
      balance: totalExpenses - totalPaid
    };
  }
});