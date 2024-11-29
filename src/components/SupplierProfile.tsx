import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Supplier } from '../types';
import { 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  CreditCard,
  Wallet,
  ChevronDown,
  ChevronUp,
  Receipt,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { formatCurrency } from '../utils/invoiceUtils';

interface Props {
  supplier: Supplier;
  onBack: () => void;
}

export const SupplierProfile: React.FC<Props> = ({ supplier, onBack }) => {
  const { receipts } = useStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const supplierData = useMemo(() => {
    const supplierReceipts = receipts.filter(r => r.supplierId === supplier.id);
    
    const totalExpenses = supplierReceipts
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalPaid = supplierReceipts
      .filter(r => r.type === 'payment')
      .reduce((sum, r) => sum + r.amount, 0);

    const paymentStats = {
      cash: supplierReceipts
        .filter(r => r.paymentMethod?.type === 'cash')
        .reduce((sum, r) => sum + r.amount, 0),
      bank: supplierReceipts
        .filter(r => r.paymentMethod?.type === 'bank')
        .reduce((sum, r) => sum + r.amount, 0),
      check: supplierReceipts
        .filter(r => r.paymentMethod?.type === 'check')
        .reduce((sum, r) => sum + r.amount, 0),
      pos: supplierReceipts
        .filter(r => r.paymentMethod?.type === 'pos')
        .reduce((sum, r) => sum + r.amount, 0)
    };

    return {
      receipts: supplierReceipts,
      stats: {
        totalExpenses,
        totalPaid,
        balance: totalExpenses - totalPaid,
        paymentStats
      }
    };
  }, [supplier.id, receipts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة للقائمة
        </button>
      </div>

      {/* Supplier Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className={clsx(
            "p-3 rounded-lg",
            supplier.type === 'company' ? "bg-purple-100" : "bg-blue-100"
          )}>
            <Building2 className={clsx(
              "w-6 h-6",
              supplier.type === 'company' ? "text-purple-600" : "text-blue-600"
            )} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{supplier.name}</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {supplier.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                {supplier.phone}
              </div>
              {supplier.type === 'company' && (
                <>
                  {supplier.commercialRegister && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      سجل تجاري: {supplier.commercialRegister}
                    </div>
                  )}
                  {supplier.vatNumber && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      الرقم الضريبي: {supplier.vatNumber}
                    </div>
                  )}
                </>
              )}
              {supplier.category && supplier.category.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {supplier.category.map((cat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المشتريات</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المشتريات</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(supplierData.stats.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المدفوع</span>
              <span className="font-medium text-green-600">
                {formatCurrency(supplierData.stats.totalPaid)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-700">المستحق</span>
              <span className={clsx(
                "font-medium",
                supplierData.stats.balance > 0 ? "text-red-600" : "text-green-600"
              )}>
                {formatCurrency(supplierData.stats.balance)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
          {supplier.type === 'company' && supplier.contactPerson && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">المسؤول:</span>
                {supplier.contactPerson.name}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">المنصب:</span>
                {supplier.contactPerson.position}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">الجوال:</span>
                {supplier.contactPerson.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">البريد:</span>
                {supplier.contactPerson.email}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات البنكية</h3>
          {supplier.bankInfo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">البنك:</span>
                {supplier.bankInfo.bankName}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">رقم الحساب:</span>
                {supplier.bankInfo.accountNumber}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">IBAN:</span>
                {supplier.bankInfo.iban}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل المدفوعات</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">نقدي</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(supplierData.stats.paymentStats.cash)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">تحويل بنكي</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(supplierData.stats.paymentStats.bank)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">شيكات</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(supplierData.stats.paymentStats.check)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">شبكة</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(supplierData.stats.paymentStats.pos)}
            </span>
          </div>
        </div>
      </div>

      {/* Receipts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div
          className="p-6 flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'receipts' ? null : 'receipts')}
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">السندات</h3>
          </div>
          {expandedSection === 'receipts' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <AnimatePresence>
          {expandedSection === 'receipts' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم السند
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        طريقة الدفع
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {supplierData.receipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(receipt.date).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(receipt.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {receipt.paymentMethod?.type === 'cash' && (
                              <Wallet className="w-4 h-4 text-gray-400" />
                            )}
                            {receipt.paymentMethod?.type === 'bank' && (
                              <Building2 className="w-4 h-4 text-gray-400" />
                            )}
                            {receipt.paymentMethod?.type === 'check' && (
                              <CreditCard className="w-4 h-4 text-gray-400" />
                            )}
                            {receipt.paymentMethod?.type === 'pos' && (
                              <CreditCard className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-900">
                              {receipt.paymentMethod?.type === 'cash' ? 'نقدي' :
                               receipt.paymentMethod?.type === 'bank' ? 'تحويل بنكي' :
                               receipt.paymentMethod?.type === 'check' ? 'شيك' :
                               receipt.paymentMethod?.type === 'pos' ? 'شبكة' : ''}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};