import { ProjectTemplate } from '../types';

export const initialTemplates: ProjectTemplate[] = [
  {
    id: '1',
    title: 'مشروع مبنى سكني',
    description: 'قالب لمشروع تصميم وإشراف على مبنى سكني متعدد الطوابق',
    tasks: [
      {
        title: 'دراسة الموقع والمتطلبات',
        description: 'تحليل الموقع ودراسة متطلبات العميل والأنظمة البلدية',
        estimatedDuration: 5,
        requiredDepartments: ['التصميم المعماري'],
        dependsOn: [],
        assignedTo: ['2']
      },
      {
        title: 'التصميم المعماري المبدئي',
        description: 'إعداد المخططات المعمارية الأولية والواجهات',
        estimatedDuration: 10,
        requiredDepartments: ['التصميم المعماري'],
        dependsOn: ['0'],
        assignedTo: ['2']
      },
      {
        title: 'التصميم الإنشائي',
        description: 'إعداد المخططات الإنشائية وحسابات الأحمال',
        estimatedDuration: 15,
        requiredDepartments: ['الهندسة الإنشائية'],
        dependsOn: ['1'],
        assignedTo: ['3']
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'مشروع مجمع تجاري',
    description: 'قالب لمشروع تصميم مجمع تجاري متعدد الاستخدامات',
    tasks: [
      {
        title: 'دراسة السوق والمتطلبات',
        description: 'تحليل احتياجات السوق ومتطلبات المشروع التجاري',
        estimatedDuration: 7,
        requiredDepartments: ['التصميم المعماري'],
        dependsOn: [],
        assignedTo: ['2']
      },
      {
        title: 'المخطط العام والتصميم المعماري',
        description: 'تصميم المخطط العام وتوزيع المحلات والمرافق',
        estimatedDuration: 15,
        requiredDepartments: ['التصميم المعماري'],
        dependsOn: ['0'],
        assignedTo: ['2']
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'مشروع مستشفى',
    description: 'قالب لمشروع تصميم مستشفى متكامل',
    tasks: [
      {
        title: 'دراسة المعايير الطبية',
        description: 'دراسة معايير تصميم المستشفيات والمتطلبات الطبية',
        estimatedDuration: 10,
        requiredDepartments: ['التصميم المعماري'],
        dependsOn: [],
        assignedTo: ['2']
      },
      {
        title: 'التصميم المعماري التخصصي',
        description: 'تصميم الأقسام الطبية والمرافق المتخصصة',
        estimatedDuration: 20,
        requiredDepartments: ['التصميم المعماري'],
        dependsOn: ['0'],
        assignedTo: ['2']
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];