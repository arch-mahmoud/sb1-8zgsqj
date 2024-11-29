export type Receipt = {
  id: string;
  number: string;
  type: 'payment' | 'expense';
  clientId?: string;
  supplierId?: string;
  beneficiary?: string;
  amount: number;
  date: Date;
  notes?: string;
  category?: string;
  paymentMethod: {
    type: 'cash' | 'bank' | 'check' | 'pos';
    checkNumber?: string;
    bankName?: string;
    accountNumber?: string;
    posReference?: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'company';
  commercialRegister?: string;
  vatNumber?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    iban: string;
  };
  contactPerson?: {
    name: string;
    phone: string;
    email: string;
    position: string;
  };
  category: string[];
  createdAt: Date;
  updatedAt: Date;
  balance: number;
  notes?: string;
  paymentTerms?: {
    enabled: boolean;
    daysCount: number;
  };
};