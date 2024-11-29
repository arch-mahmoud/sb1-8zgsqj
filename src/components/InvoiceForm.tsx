import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { InvoiceItem } from '../types';
import { Plus, Trash2, Calculator, Building2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/invoiceUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const InvoiceForm: React.FC = () => {
  const { clients, projects, addInvoice } = useStore();
  const [clientId, setClientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [bankAccount, setBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    iban: ''
  });

  // Get available projects for the selected client
  const availableProjects = projects.filter(p => 
    p.clientId === clientId && 
    !items.some(item => item.projectId === p.id)
  );

  // Get client VAT number if facility
  const selectedClient = clients.find(c => c.id === clientId);
  const clientVatNumber = selectedClient?.type === 'facility' ? selectedClient.facilityInfo?.vatNumber : undefined;

  const createEmptyItem = (projectId?: string): InvoiceItem => {
    const project = projectId ? projects.find(p => p.id === projectId) : null;
    return {
      id: crypto.randomUUID(),
      projectId: projectId || '',
      description: project?.title || '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      vatAmount: 0,
      totalWithoutVat: 0,
      totalWithVat: 0
    };
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalWithoutVat, 0);
    const vatTotal = items.reduce((sum, item) => sum + item.vatAmount, 0);
    const total = items.reduce((sum, item) => sum + item.totalWithVat, 0);
    return { subtotal, vatTotal, total };
  };

  const handleAddItem = () => {
    const newItem = createEmptyItem(selectedProject);
    setItems([...items, newItem]);
    setSelectedProject('');
  };

  const handleItemChange = (index: number, updates: Partial<InvoiceItem>) => {
    const updatedItems = [...items];
    let item = { ...updatedItems[index], ...updates };
    
    // If project changed, update description
    if (updates.projectId) {
      const project = projects.find(p => p.id === updates.projectId);
      if (project) {
        item.description = project.title;
      }
    }
    
    // Recalculate totals
    item.totalWithoutVat = item.quantity * item.unitPrice;
    item.vatAmount = (item.totalWithoutVat * item.vatRate) / 100;
    item.totalWithVat = item.totalWithoutVat + item.vatAmount;
    
    updatedItems[index] = item;
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0 || !dueDate) return;
    
    const { subtotal, vatTotal, total } = calculateTotals();

    try {
      await addInvoice({
        clientId,
        date: new Date(),
        dueDate: new Date(dueDate),
        items,
        subtotal,
        vatTotal,
        total,
        status: 'draft',
        notes,
        bankAccount: bankAccount.iban ? bankAccount : undefined,
        vatNumber: clientVatNumber
      });

      // Reset form
      setClientId('');
      setDueDate('');
      setNotes('');
      setItems([]);
      setBankAccount({
        bankName: '',
        accountNumber: '',
        iban: ''
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Selection Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">معلومات العميل</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              العميل
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">اختر العميل</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                  {client.type === 'facility' && client.facilityInfo?.vatNumber && 
                    ` (رقم ضريبي: ${client.facilityInfo.vatNumber})`
                  }
                </option>
              ))}
            </select>
          </div>

          {clientVatNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الرقم الضريبي
              </label>
              <div className="mt-2 text-gray-900 font-medium">
                {clientVatNumber}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              تاريخ الاستحقاق
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Invoice Items Section */}
      {clientId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">بنود الفاتورة</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            > 
              <Plus className="w-5 h-5" />
              إضافة بند
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg relative group hover:bg-gray-100 transition-colors"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    المشروع والوصف
                  </label>
                  <select
                    value={item.projectId}
                    onChange={(e) => handleItemChange(index, {
                      projectId: e.target.value,
                      description: projects.find(p => p.id === e.target.value)?.title || '',
                      quantity: 1,
                      unitPrice: 0,
                      vatAmount: 0,
                      totalWithoutVat: 0,
                      totalWithVat: 0
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- اختر المشروع --</option>
                    {projects.filter(p => p.clientId === clientId).map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, { description: e.target.value })}
                    placeholder="وصف إضافي"
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    الكمية
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, { quantity: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    السعر
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    المجموع
                  </label>
                  <div className="mt-2 font-medium text-gray-900">
                    {formatCurrency(item.totalWithVat)}
                  </div>
                  <div className="text-sm text-gray-500">
                    شامل {formatCurrency(item.vatAmount)} ضريبة
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {availableProjects.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-4">المشاريع المتاحة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => {
                      const newItem = createEmptyItem(project.id);
                      setItems([...items, newItem]);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع قبل الضريبة:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(calculateTotals().subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ضريبة القيمة المضافة (15%):</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(calculateTotals().vatTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span>الإجمالي:</span>
                    <span className="text-blue-600">
                      {formatCurrency(calculateTotals().total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ملاحظات
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">معلومات الحساب البنكي</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                اسم البنك
              </label>
              <input
                type="text"
                value={bankAccount.bankName}
                onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                رقم الحساب
              </label>
              <input
                type="text"
                value={bankAccount.accountNumber}
                onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IBAN
              </label>
              <input
                type="text"
                value={bankAccount.iban}
                onChange={(e) => setBankAccount({ ...bankAccount, iban: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                pattern="SA[0-9]{22}"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              مثال: SA0000000000000000000000
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Calculator className="w-5 h-5" />
          إنشاء الفاتورة
        </button>
      </div>
    </form>
  );
};