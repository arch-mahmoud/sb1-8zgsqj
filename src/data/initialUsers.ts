import { User } from '../types';

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    role: 'manager',
    email: 'ahmed@example.com',
    department: 'الإدارة',
    position: 'مدير المكتب',
    joinDate: new Date('2023-01-01'),
    active: true,
  },
  {
    id: '2',
    name: 'سارة علي',
    role: 'employee',
    email: 'sara@example.com',
    department: 'التصميم المعماري',
    position: 'مهندسة معمارية',
    joinDate: new Date('2023-02-15'),
    active: true,
  },
  {
    id: '3',
    name: 'محمد خالد',
    role: 'employee',
    email: 'mohammed@example.com',
    department: 'الهندسة الإنشائية',
    position: 'مهندس إنشائي',
    joinDate: new Date('2023-03-01'),
    active: true,
  },
  {
    id: '4',
    name: 'فاطمة عمر',
    role: 'employee',
    email: 'fatima@example.com',
    department: 'الهندسة الكهربائية',
    position: 'مهندسة كهربائية',
    joinDate: new Date('2023-04-01'),
    active: true,
  },
  {
    id: '5',
    name: 'عبدالله يوسف',
    role: 'employee',
    email: 'abdullah@example.com',
    department: 'الهندسة الميكانيكية',
    position: 'مهندس ميكانيكي',
    joinDate: new Date('2023-05-01'),
    active: true,
  },
];