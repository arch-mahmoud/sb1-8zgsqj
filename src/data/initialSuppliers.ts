import { Supplier } from '../types';

export const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'شركة الإنشاءات المتطورة',
    email: 'info@advanced-construction.com',
    phone: '0555555555',
    address: 'الرياض - حي العليا',
    type: 'company',
    commercialRegister: '1010111111',
    vatNumber: '300000000000001',
    category: ['مواد بناء', 'معدات'],
    bankInfo: {
      bankName: 'البنك الأهلي',
      accountNumber: '1234567890',
      iban: 'SA0000000000001234567890'
    },
    contactPerson: {
      name: 'أحمد محمد',
      phone: '0566666666',
      email: 'ahmed@advanced-construction.com',
      position: 'مدير المبيعات'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    balance: 0,
    paymentTerms: {
      enabled: true,
      daysCount: 30
    }
  },
  {
    id: '2',
    name: 'مؤسسة التوريدات الكهربائية',
    email: 'info@electrical-supplies.com',
    phone: '0544444444',
    address: 'جدة - حي الصناعية',
    type: 'company',
    commercialRegister: '4030222222',
    vatNumber: '300000000000002',
    category: ['توريدات كهربائية'],
    bankInfo: {
      bankName: 'مصرف الراجحي',
      accountNumber: '9876543210',
      iban: 'SA0000000000009876543210'
    },
    contactPerson: {
      name: 'خالد عبدالله',
      phone: '0577777777',
      email: 'khalid@electrical-supplies.com',
      position: 'المدير التنفيذي'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    balance: 0,
    paymentTerms: {
      enabled: true,
      daysCount: 45
    }
  },
  {
    id: '3',
    name: 'عبدالرحمن السالم للمقاولات',
    email: 'abdulrahman@example.com',
    phone: '0533333333',
    address: 'الدمام - حي النور',
    type: 'individual',
    category: ['مقاولات', 'خدمات'],
    bankInfo: {
      bankName: 'بنك الرياض',
      accountNumber: '5555555555',
      iban: 'SA0000000000005555555555'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    balance: 0
  },
  {
    id: '4',
    name: 'مؤسسة المعدات الميكانيكية',
    email: 'info@mechanical-equipment.com',
    phone: '0599999999',
    address: 'الرياض - المنطقة الصناعية الثانية',
    type: 'company',
    commercialRegister: '1010333333',
    vatNumber: '300000000000003',
    category: ['معدات', 'توريدات ميكانيكية'],
    bankInfo: {
      bankName: 'البنك السعودي الفرنسي',
      accountNumber: '1111222233',
      iban: 'SA0000000000001111222233'
    },
    contactPerson: {
      name: 'فهد العمري',
      phone: '0588888888',
      email: 'fahad@mechanical-equipment.com',
      position: 'مدير العمليات'
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    balance: 0,
    paymentTerms: {
      enabled: true,
      daysCount: 60
    }
  }
];