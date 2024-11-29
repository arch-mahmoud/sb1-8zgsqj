import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Receipt, Building2, Calendar, Calculator, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/invoiceUtils';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const PaymentReceiptForm: React.FC = () => {
  const { clients, invoices, addReceipt } = useStore();
  const [clientId, setClientId] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<{
    type: 'cash' | 'bank' | 'check' | 'pos';
    checkNumber?: string;
    bankName?: string;
    accountNumber?: string;
    posReference?: string;
  }>({
    type: 'cash'
  });

  // Get unpaid invoices for selected client
  const clientInvoices = invoices.filter(inv => 
    inv.clientId === clientId && 
    inv.status === 'issued'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !amount || !date) return;

    const client = clients.find(c => c.id === clientId);

    if (client) {
      const updatedClient = {
        ...client,
        totalDue: (client.totalDue || 0) + parseFloat(amount), // تحديث المستحقات
      };
    
      // تحديث بيانات العميل في المخزن
      updateClientData(updatedClient);
    }
    
    addReceipt({
      type: 'payment',
      clientId,
      invoiceId: invoiceId || undefined,
      amount: parseFloat(amount),
      date: new Date(date),
      notes,
      paymentMethod
    });
    

    // Reset form
    setClientId('');
    setInvoiceId('');
    setAmount('');
    setDate('');
    setNotes('');
    setPaymentMethod({ type: 'cash' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">معلومات السند</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              العميل
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setInvoiceId('');
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">اختر العميل</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {clientId && clientInvoices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الفاتورة (اختياري)
              </label>
              <select
                value={invoiceId}
                onChange={(e) => {
                  setInvoiceId(e.target.value);
                  if (e.target.value) {
                    const invoice = invoices.find(inv => inv.id === e.target.value);
                    if (invoice) {
                      setAmount(invoice.total.toString());
                    }
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">اختر الفاتورة</option>
                {clientInvoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.number} - {formatCurrency(invoice.total)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              المبلغ
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              التاريخ
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">طريقة الدفع</h3>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod.type === 'cash'}
                onChange={() => setPaymentMethod({ type: 'cash' })}
                className="ml-2"
              />
              نقدي
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod.type === 'bank'}
                onChange={() => setPaymentMethod({ type: 'bank' })}
                className="ml-2"
              />
              تحويل بنكي
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod.type === 'check'}
                onChange={() => setPaymentMethod({ type: 'check' })}
                className="ml-2"
              />
              شيك
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={paymentMethod.type === 'pos'}
                onChange={() => setPaymentMethod({ type: 'pos' })}
                className="ml-2"
              />
              شبكة
            </label>
          </div>

          {paymentMethod.type === 'bank' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  اسم البنك
                </label>
                <input
                  type="text"
                  value={paymentMethod.bankName || ''}
                  onChange={(e) => setPaymentMethod({
                    ...paymentMethod,
                    bankName: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم الحساب
                </label>
                <input
                  type="text"
                  value={paymentMethod.accountNumber || ''}
                  onChange={(e) => setPaymentMethod({
                    ...paymentMethod,
                    accountNumber: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod.type === 'check' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                رقم الشيك
              </label>
              <input
                type="text"
                value={paymentMethod.checkNumber || ''}
                onChange={(e) => setPaymentMethod({
                  ...paymentMethod,
                  checkNumber: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {paymentMethod.type === 'pos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                رقم العملية
              </label>
              <input
                type="text"
                value={paymentMethod.posReference || ''}
                onChange={(e) => setPaymentMethod({
                  ...paymentMethod,
                  posReference: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">معلومات إضافية</h3>
        </div>

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
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Calculator className="w-5 h-5" />
          إنشاء سند القبض
        </button>
      </div>
    </form>
  );
};