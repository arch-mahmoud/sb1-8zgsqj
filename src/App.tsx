import React, { useState } from 'react';
import { UserSelect } from './components/UserSelect';
import { ProjectForm } from './components/ProjectForm';
import { ProjectList } from './components/ProjectList';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceList } from './components/InvoiceList';
import { NotificationBell } from './components/NotificationBell';
import { ManagerStats } from './components/ManagerStats';
import { EmployeeStats } from './components/EmployeeStats';
import { EmployeeManagement } from './components/EmployeeManagement';
import { ProjectTemplates } from './components/ProjectTemplates';
import { Settings } from './components/Settings';
import { NotificationsPage } from './components/NotificationsPage';
import { HomePage } from './components/HomePage';
import { ClientsList } from './components/ClientsList';
import { ReceiptList } from './components/ReceiptList';
import { PaymentReceiptForm } from './components/PaymentReceiptForm';
import { ExpenseReceiptForm } from './components/ExpenseReceiptForm';
import { PromissoryNoteForm } from './components/PromissoryNoteForm';
import { EmployeeProfile } from './components/EmployeeProfile';
import { ClientManagement } from './components/ClientManagement';
import { ManagerSidebar } from './components/ManagerSidebar';
import { FinancialReports } from './components/FinancialReports';
import { SupplierForm } from './components/SupplierForm';
import { SupplierList } from './components/SupplierList';
import { useStore } from './store/useStore';
import { User } from './types';

function App() {
  const { currentUser, settings } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      <nav className="bg-[#1B2A4E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img 
                src={settings.logo}
                alt="الشعار" 
                className="h-12"
              />
            </div>
            <div className="flex items-center gap-4">
              <UserSelect />
              {currentUser && (
                <NotificationBell 
                  onNotificationsClick={() => {
                    setShowNotifications(!showNotifications);
                    setSelectedEmployee(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-5rem)]">
        {currentUser?.role === 'manager' && !showNotifications && !selectedEmployee && (
          <ManagerSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        )}

        <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8">
          {currentUser ? (
            showNotifications ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">الإشعارات</h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    العودة للوحة التحكم
                  </button>
                </div>
                <NotificationsPage />
              </div>
            ) : selectedEmployee ? (
              <EmployeeProfile 
                employee={selectedEmployee} 
                onBack={() => setSelectedEmployee(null)} 
              />
            ) : (
              <div className="space-y-8">
                {currentUser.role === 'manager' ? (
                  <>
                    {activeSection === 'settings' ? (
                      <div className="space-y-8">
                        <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-gray-900">إعدادات النظام</h2>
                        </div>
                        <Settings />
                      </div>
                    ) : activeSection === 'add-client' ? (
                      <ClientManagement />
                    ) : activeSection === 'view-clients' ? (
                      <ClientsList />
                    ) : activeSection === 'add-supplier' ? (
                      <SupplierForm />
                    ) : activeSection === 'view-suppliers' ? (
                      <SupplierList />
                    ) : activeSection === 'home' ? (
                      <HomePage onEmployeeSelect={setSelectedEmployee} />
                    ) : activeSection === 'projects' ? (
                      <div className="space-y-8">
                        <ProjectTemplates />
                      </div>
                    ) : activeSection === 'employees' ? (
                      <div className="space-y-8">
                        <EmployeeManagement onEmployeeSelect={setSelectedEmployee} />
                      </div>
                    ) : activeSection === 'create-invoice' ? (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">إنشاء فاتورة</h2>
                        <InvoiceForm />
                      </div>
                    ) : activeSection === 'view-invoices' ? (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">الفواتير</h2>
                        <InvoiceList />
                      </div>
                    ) : activeSection === 'create-payment-receipt' ? (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">إنشاء سند قبض</h2>
                        <PaymentReceiptForm />
                      </div>
                    ) : activeSection === 'create-expense-receipt' ? (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">إنشاء سند صرف</h2>
                        <ExpenseReceiptForm />
                      </div>
                    ) : activeSection === 'create-promissory-note' ? (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">إنشاء سند لأمر</h2>
                        <PromissoryNoteForm />
                      </div>
                    ) : activeSection === 'view-receipts' ? (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">السندات</h2>
                        <ReceiptList />
                      </div>
                    ) : activeSection === 'financial-reports' ? (
                      <FinancialReports />
                    ) : null}
                  </>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-[#1B2A4E] mb-6">
                        لوحة المعلومات
                      </h2>
                      <EmployeeStats />
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#1B2A4E] mb-6">
                      المشاريع
                    </h2>
                    <ProjectList />
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <img 
                src={settings.logo}
                alt="الشعار"
                className="w-32 h-32 mx-auto mb-6"
              />
              <h2 className="text-2 xl font-bold text-[#1B2A4E] mb-2">
                مرحباً بك في نظام إدارة المشاريع
              </h2>
              <p className="text-gray-500">
                الرجاء اختيار مستخدم للبدء في إدارة المشاريع والمهام
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;