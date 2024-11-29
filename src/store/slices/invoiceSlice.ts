import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, Receipt, PromissoryNote } from '../../types';
import { generateQRCode } from '../../utils/invoiceUtils';

export interface InvoiceSlice {
  invoices: Invoice[];
  receipts: Receipt[];
  promissoryNotes: PromissoryNote[];
  addInvoice: (invoiceData: Omit<Invoice, 'id' | 'number' | 'qrCode' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  addReceipt: (receiptData: Omit<Receipt, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => Receipt;
  addPromissoryNote: (noteData: Omit<PromissoryNote, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  payPromissoryNote: (id: string) => void;
  cancelPromissoryNote: (id: string) => void;
  getNextInvoiceNumber: () => string;
  activateInvoice: (id: string) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  markAsPaid: (id: string) => void;
  deleteInvoice: (id: string) => void;
  getNextReceiptNumber: () => string;
  getNextExpenseNumber: () => string;
  getNextPromissoryNoteNumber: () => string;
  getClientBalance: (clientId: string) => { totalInvoiced: number; totalPaid: number; balance: number };
  getClientPayments: (clientId: string) => { total: number; byMethod: Record<string, number> };
  getSupplierBalance: (supplierId: string) => { totalExpenses: number; totalPaid: number; balance: number };
  getRevenue: (startDate?: Date, endDate?: Date) => { 
    total: number;
    byMethod: Record<string, number>;
    byMonth: Array<{ month: string; amount: number }>;
  };
}

export const createInvoiceSlice: StateCreator<InvoiceSlice> = (set, get) => ({
  invoices: [],
  receipts: [],
  promissoryNotes: [],

  getRevenue: (startDate?: Date, endDate?: Date) => {
    const { receipts } = get();
    const now = endDate || new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Filter payment receipts within date range
    const filteredReceipts = receipts.filter(receipt => 
      receipt.type === 'payment' &&
      receipt.clientId && // Only include client payments
      new Date(receipt.date) >= start &&
      new Date(receipt.date) <= now
    );

    // Calculate total revenue
    const total = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);

    // Group by payment method
    const byMethod = filteredReceipts.reduce((acc, receipt) => {
      const method = receipt.paymentMethod?.type || 'cash';
      acc[method] = (acc[method] || 0) + receipt.amount;
      return acc;
    }, {} as Record<string, number>);

    // Group by month
    const byMonth = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthReceipts = filteredReceipts.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receiptDate.getMonth() === month.getMonth() &&
               receiptDate.getFullYear() === month.getFullYear();
      });
      
      return {
        month: month.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
        amount: monthReceipts.reduce((sum, receipt) => sum + receipt.amount, 0)
      };
    }).reverse();

    return { total, byMethod, byMonth };
  },

  getClientBalance: (clientId: string) => {
    const { invoices, receipts } = get();
    
    // Get all issued or paid invoices for the client
    const clientInvoices = invoices.filter(inv => 
      inv.clientId === clientId && 
      (inv.status === 'issued' || inv.status === 'paid')
    );

    // Get all payment receipts for the client
    const clientPayments = receipts.filter(r => 
      r.clientId === clientId && 
      r.type === 'payment'
    );

    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = clientPayments.reduce((sum, r) => sum + r.amount, 0);

    return {
      totalInvoiced,
      totalPaid,
      balance: totalInvoiced - totalPaid
    };
  },

  getSupplierBalance: (supplierId: string) => {
    const { receipts } = get();
    const supplierReceipts = receipts.filter(r => r.supplierId === supplierId);
    
    // Calculate total expenses (purchases)
    const totalExpenses = supplierReceipts
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    
    // Calculate total payments made to supplier
    const totalPaid = supplierReceipts
      .filter(r => r.type === 'payment')
      .reduce((sum, r) => sum + r.amount, 0);

    // Outstanding balance is expenses minus payments
    return {
      totalExpenses,
      totalPaid,
      balance: totalExpenses - totalPaid
    };
  },

  getClientPayments: (clientId: string) => {
    const { receipts } = get();
    const clientPayments = receipts.filter(r => 
      r.clientId === clientId && 
      r.type === 'payment'
    );
    
    const total = clientPayments.reduce((sum, r) => sum + r.amount, 0);
    const byMethod = clientPayments.reduce((acc, r) => {
      const method = r.paymentMethod?.type || 'cash';
      acc[method] = (acc[method] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

    return { total, byMethod };
  },

  getNextPromissoryNoteNumber: () => {
    const { promissoryNotes } = get();
    const lastNumber = promissoryNotes
      .map(note => parseInt(note.number.split('-')[2] || '0'))
      .reduce((max, num) => Math.max(max, num), 0);
    const year = new Date().getFullYear();
    return `PRM-${year}-${String(lastNumber + 1).padStart(6, '0')}`;
  },

  addPromissoryNote: (noteData) => {
    const number = get().getNextPromissoryNoteNumber();
    set((state) => ({
      promissoryNotes: [...state.promissoryNotes, {
        id: uuidv4(),
        number,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...noteData,
      }]
    }));
  },

  payPromissoryNote: (id) => {
    const { promissoryNotes, addReceipt } = get();
    const note = promissoryNotes.find(n => n.id === id);
    if (!note || note.status !== 'active') return;

    const now = new Date();
    const receipt = addReceipt({
      type: 'payment',
      clientId: note.clientId,
      amount: note.amount,
      date: now,
      notes: `سداد سند لأمر رقم ${note.number}`,
      paymentMethod: { type: 'cash' }
    });

    set((state) => ({
      promissoryNotes: state.promissoryNotes.map(n =>
        n.id === id ? {
          ...n,
          status: 'paid',
          paymentDate: now,
          receiptId: receipt.id,
          updatedAt: now
        } : n
      )
    }));
  },

  cancelPromissoryNote: (id) => set((state) => ({
    promissoryNotes: state.promissoryNotes.map(note =>
      note.id === id ? {
        ...note,
        status: 'cancelled',
        updatedAt: new Date()
      } : note
    )
  })),

  getNextInvoiceNumber: () => {
    const { invoices } = get();
    const lastNumber = invoices
      .map(inv => parseInt(inv.number.split('-')[2] || '0'))
      .reduce((max, num) => Math.max(max, num), 0);
    const year = new Date().getFullYear();
    return `INV-${year}-${String(lastNumber + 1).padStart(6, '0')}`;
  },

  getNextReceiptNumber: () => {
    const { receipts } = get();
    const lastNumber = receipts
      .filter(r => r.type === 'payment')
      .map(rec => parseInt(rec.number.split('-')[2] || '0'))
      .reduce((max, num) => Math.max(max, num), 0);
    const year = new Date().getFullYear();
    return `RCP-${year}-${String(lastNumber + 1).padStart(6, '0')}`;
  },

  getNextExpenseNumber: () => {
    const { receipts } = get();
    const lastNumber = receipts
      .filter(r => r.type === 'expense')
      .map(rec => parseInt(rec.number.split('-')[2] || '0'))
      .reduce((max, num) => Math.max(max, num), 0);
    const year = new Date().getFullYear();
    return `EXP-${year}-${String(lastNumber + 1).padStart(6, '0')}`;
  },

  addInvoice: async (invoiceData) => {
    const number = get().getNextInvoiceNumber();
    const qrCode = await generateQRCode({
      sellerName: "اسم الشركة",
      vatNumber: invoiceData.vatNumber || "000000000000000",
      timestamp: new Date().toISOString(),
      invoiceTotal: invoiceData.total,
      vatAmount: invoiceData.vatTotal
    });

    set((state) => ({
      invoices: [...state.invoices, {
        id: uuidv4(),
        number,
        qrCode,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...invoiceData,
      }]
    }));
  },

  addReceipt: (receiptData) => {
    const number = receiptData.type === 'payment' 
      ? get().getNextReceiptNumber()
      : get().getNextExpenseNumber();

    const receipt = {
      id: uuidv4(),
      number,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...receiptData,
    };

    set((state) => ({
      receipts: [...state.receipts, receipt]
    }));

    // If receipt is linked to an invoice, update invoice status
    if (receipt.type === 'payment' && receipt.invoiceId) {
      const { invoices } = get();
      const invoice = invoices.find(inv => inv.id === receipt.invoiceId);
      if (invoice) {
        const allReceipts = [...get().receipts, receipt];
        const invoiceReceipts = allReceipts.filter(r => r.invoiceId === invoice.id);
        const totalPaid = invoiceReceipts.reduce((sum, r) => sum + r.amount, 0);

        if (totalPaid >= invoice.total) {
          set((state) => ({
            invoices: state.invoices.map(inv =>
              inv.id === invoice.id ? {
                ...inv,
                status: 'paid',
                updatedAt: new Date()
              } : inv
            )
          }));
        }
      }
    }

    return receipt;
  },

  activateInvoice: (id) => {
    const { invoices } = get();
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice || invoice.status !== 'draft') return;

    set((state) => ({
      invoices: state.invoices.map(inv =>
        inv.id === id ? {
          ...inv,
          status: 'issued',
          updatedAt: new Date()
        } : inv
      )
    }));
  },

  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...updates, updatedAt: new Date() } : invoice
    )
  })),

  markAsPaid: (id) => {
    const { invoices } = get();
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const receipt = get().addReceipt({
      type: 'payment',
      invoiceId: id,
      clientId: invoice.clientId,
      amount: invoice.total,
      date: new Date(),
      notes: `سداد الفاتورة رقم ${invoice.number}`,
      paymentMethod: { type: 'cash' }
    });

    set((state) => ({
      invoices: state.invoices.map(inv =>
        inv.id === id ? {
          ...inv,
          status: 'paid',
          updatedAt: new Date()
        } : inv
      )
    }));
  },

  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(invoice => invoice.id !== id)
  })),
});