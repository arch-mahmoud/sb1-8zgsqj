import { Client } from '../types';

export const initialClients: Client[] = [
  {
    id: '1',
    name: 'السادة/ شركة الأفق للمقاولات',
    email: 'info@alofuq.com',
    phone: '0555555555',
    address: 'الرياض - حي الملقا',
    type: 'facility',
    projects: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    registrationType: 'direct',
    facilityInfo: {
      commercialRegister: '1010555555',
      registerExpiry: '2025-06-30',
      authorizedPerson: {
        name: 'فهد عبدالله العمري',
        idNumber: '1055555555',
        phone: '0566666666',
        gender: 'male',
        title: 'المدير التنفيذي'
      }
    }
  },
  {
    id: '2',
    name: 'السيد/ محمد أحمد العتيبي',
    email: 'mohammed@example.com',
    phone: '0577777777',
    address: 'جدة - حي الروضة',
    type: 'individual',
    projects: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    registrationType: 'direct',
    directInfo: {
      idNumber: '1066666666',
      birthDate: '1980-05-15',
      age: 43,
      gender: 'male'
    }
  },
  {
    id: '3',
    name: 'السادة/ مؤسسة النخبة للتطوير العقاري',
    email: 'info@nokhba.com',
    phone: '0588888888',
    address: 'الدمام - حي الشاطئ',
    type: 'facility',
    projects: [],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    registrationType: 'direct',
    facilityInfo: {
      commercialRegister: '2050777777',
      registerExpiry: '2024-12-31',
      authorizedPerson: {
        name: 'سارة خالد المالكي',
        idNumber: '1077777777',
        phone: '0599999999',
        gender: 'female',
        title: 'مدير المشاريع'
      }
    }
  },
  {
    id: '4',
    name: 'السيدة/ نورة سعد القحطاني',
    email: 'noura@example.com',
    phone: '0511111111',
    address: 'الرياض - حي النرجس',
    type: 'individual',
    projects: [],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    registrationType: 'direct',
    directInfo: {
      idNumber: '1088888888',
      birthDate: '1990-08-20',
      age: 33,
      gender: 'female'
    }
  },
  {
    id: '5',
    name: 'السادة/ شركة البناء المتكامل',
    email: 'info@integrated.com',
    phone: '0522222222',
    address: 'مكة المكرمة - حي العزيزية',
    type: 'facility',
    projects: [],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    registrationType: 'direct',
    facilityInfo: {
      commercialRegister: '4030999999',
      registerExpiry: '2025-03-15',
      authorizedPerson: {
        name: 'عبدالرحمن محمد السالم',
        idNumber: '1099999999',
        phone: '0533333333',
        gender: 'male',
        title: 'مدير العمليات'
      }
    }
  }
];