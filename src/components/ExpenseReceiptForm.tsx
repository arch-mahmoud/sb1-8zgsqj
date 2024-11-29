import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Receipt, Building2, Calendar, Calculator, Truck, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/invoiceUtils';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const ExpenseReceiptForm: React.FC = () => {
  const { addReceipt, suppliers, getSupplierBalance } = useStore();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<{
    type: 'cash' | 'bank' | 'check' | 'pos';
    checkNumber?: string;
    bankName?: string;
    accountNumber?: string;
    posReference?: string;
  }>({
    type: 'cash'
  });

  const [selectedSupplier, setSelectedSupplier] = useState<{
    balance?: number;
    paymentTerms?: boolean;
  }>({});

  useEffect(() => {
    if (supplierId) {
      const supplier = suppliers.find(s => s.id === supplierId);
      if (supplier) {
        const balance = getSupplierBalance(supplierId);
        setSelectedSupplier({
          balance: balance.balance,
          paymentTerms: supplier.paymentTerms?.enabled
        });
      }
    } else {
      setSelectedSupplier({});
    }
  }, [supplierId, suppliers, getSupplierBalance]);

  const categories = [
    'رواتب وأجور',
    'مصاريف تشغيلية',
    'أدوات مكتبية',
    'إيجارات',
    'مرافق وخدمات',
    'صيانة',
    'مصاريف تسويق',
    'مصاريف سفر',
    'مشتريات من موردين',
    'أخرى'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !category || (!supplierId && !beneficiary)) return;

    addReceipt({
      type: 'expense',
      supplierId: supplierId || undefined,
      beneficiary: !supplierId ? beneficiary : undefined,
      amount: parseFloat(amount),
      date: new Date(date),
      notes,
      category,
      paymentMethod
    });

    // Reset form
    setAmount('');
    setDate('');
    setNotes('');
    setCategory('');
    setSupplierId('');
    setBeneficiary('');
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
              المورد (اختياري)
            </label>
            <select
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                if (e.target.value) {
                  setBeneficiary('');
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">اختر المورد</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                  {supplier.paymentTerms?.enabled && ' (دفع آجل)'}
                </option>
              ))}
            </select>
            {selectedSupplier.balance && selectedSupplier.balance > 0 && (
              <p className="mt-2 text-sm text-red-600">
                المبلغ المستحق: {formatCurrency(selectedSupplier.balance)}
              </p>
            )}
          </div>

          {!supplierId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                المستفيد
              </label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={!supplierId}
                placeholder="اسم المستفيد"
              />
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              التصنيف
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">اختر التصنيف</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
          إنشاء سند الصرف
        </button>
      </div>
    </form>
  );
};