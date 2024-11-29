import React, { useState } from 'react';
import { Users, UserPlus, List, ChevronDown, ChevronUp, Settings, Home, FolderOpen, Receipt, FileText, Wallet, BarChart2, Building2, Truck } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ManagerSidebar: React.FC<Props> = ({ activeSection, onSectionChange }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems = [
    {
      title: 'الرئيسية',
      icon: Home,
      id: 'home',
      subItems: [],
    },
    {
      title: 'العملاء',
      icon: Users,
      id: 'clients',
      subItems: [
        { title: 'تسجيل عميل', icon: UserPlus, id: 'add-client' },
        { title: 'عرض العملاء', icon: List, id: 'view-clients' },
      ],
    },
    {
      title: 'المشاريع',
      icon: FolderOpen,
      id: 'projects',
      subItems: [],
    },
    {
      title: 'الموظفين',
      icon: Users,
      id: 'employees',
      subItems: [],
    },
    {
      title: 'الموردين',
      icon: Truck,
      id: 'suppliers',
      subItems: [
        { title: 'تسجيل مورد', icon: UserPlus, id: 'add-supplier' },
        { title: 'عرض الموردين', icon: List, id: 'view-suppliers' },
      ],
    },
    {
      title: 'الحسابات',
      icon: Wallet,
      id: 'accounts',
      subItems: [
        { title: 'إنشاء فاتورة', icon: FileText, id: 'create-invoice' },
        { title: 'عرض الفواتير', icon: List, id: 'view-invoices' },
        { title: 'سند قبض', icon: Receipt, id: 'create-payment-receipt' },
        { title: 'سند صرف', icon: Receipt, id: 'create-expense-receipt' },
        { title: 'سند لأمر', icon: FileText, id: 'create-promissory-note' },
        { title: 'عرض السندات', icon: List, id: 'view-receipts' },
        { title: 'التقارير المالية', icon: BarChart2, id: 'financial-reports' },
      ],
    },
    {
      title: 'الإعدادات',
      icon: Settings,
      id: 'settings',
      subItems: [],
    },
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <nav className="p-4 space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <button
              onClick={() => {
                if (item.subItems.length > 0) {
                  toggleMenu(item.id);
                } else {
                  onSectionChange(item.id);
                }
              }}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors",
                activeSection === item.id && !item.subItems.length && "bg-blue-50 text-blue-600"
              )}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
              {item.subItems.length > 0 && (
                expandedMenus.includes(item.id) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )
              )}
            </button>
            <AnimatePresence>
              {expandedMenus.includes(item.id) && item.subItems.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pr-6 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onSectionChange(subItem.id)}
                        className="w-full"
                      >
                        <div className={clsx(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                          activeSection === subItem.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        )}>
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </div>
  );
};