import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/invoiceUtils';
import { Receipt, Search, Filter, Download, X, Building2, Calendar, FileText, CreditCard, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const ReceiptList: React.FC = () => {
  const { receipts, clients, invoices } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'payment' | 'expense'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const filteredReceipts = receipts.filter(receipt => {
    const client = clients.find(c => c.id === receipt.clientId);
    const invoice = receipt.invoiceId ? invoices.find(i => i.id === receipt.invoiceId) : null;
    
    const matchesSearch = 
      receipt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (invoice?.number.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (receipt.beneficiary?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesFilter = filter === 'all' || receipt.type === filter;

    return matchesSearch && matchesFilter;
  });

  const getPaymentMethodIcon = (method: { type: string }) => {
    switch (method.type) {
      case 'cash': return <Wallet className="w-4 h-4" />;
      case 'bank': return <Building2 className="w-4 h-4" />;
      case 'check': return <CreditCard className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getPaymentMethodText = (method: { type: string }) => {
    switch (method.type) {
      case 'cash': return 'نقدي';
      case 'bank': return 'تحويل بنكي';
      case 'check': return 'شيك';
      default: return method.type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في السندات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'payment'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            سندات القبض
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            سندات الصرف
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم السند
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل / المستفيد
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
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">تحميل</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence mode="popLayout">
                {filteredReceipts.map((receipt) => {
                  const client = clients.find(c => c.id === receipt.clientId);
                  const invoice = receipt.invoiceId ? invoices.find(i => i.id === receipt.invoiceId) : null;

                  return (
                    <motion.tr
                      key={receipt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedReceipt(receipt.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {receipt.number}
                        </div>
                        {invoice && (
                          <div className="text-sm text-gray-500">
                            فاتورة: {invoice.number}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          receipt.type === 'payment'
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}>
                          {receipt.type === 'payment' ? 'قبض' : 'صرف'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {receipt.type === 'payment' ? client?.name : receipt.beneficiary}
                        </div>
                        {receipt.category && (
                          <div className="text-sm text-gray-500">
                            {receipt.category}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(receipt.date).toLocaleDateString('ar-SA')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={clsx(
                          "text-sm font-medium",
                          receipt.type === 'payment' ? "text-green-600" : "text-red-600"
                        )}>
                          {formatCurrency(receipt.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {receipt.paymentMethod && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {getPaymentMethodIcon(receipt.paymentMethod)}
                            <span>{getPaymentMethodText(receipt.paymentMethod)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle download
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filteredReceipts.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد سندات مطابقة للبحث</p>
        </div>
      )}

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full mx-4"
          >
            {(() => {
              const receipt = receipts.find(r => r.id === selectedReceipt);
              const client = receipt?.clientId ? clients.find(c => c.id === receipt.clientId) : null;
              const invoice = receipt?.invoiceId ? invoices.find(i => i.id === receipt.invoiceId) : null;
              if (!receipt) return null;

              return (
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {receipt.type === 'payment' ? 'سند قبض' : 'سند صرف'} رقم {receipt.number}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        تاريخ السند: {new Date(receipt.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {receipt.type === 'payment' && client && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{client.name}</span>
                      </div>
                    )}
                    {receipt.type === 'expense' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{receipt.beneficiary}</span>
                        </div>
                        {receipt.category && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{receipt.category}</span>
                          </div>
                        )}
                      </>
                    )}
                    {invoice && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">فاتورة رقم: {invoice.number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      <span className={clsx(
                        "font-medium",
                        receipt.type === 'payment' ? "text-green-600" : "text-red-600"
                      )}>
                        المبلغ: {formatCurrency(receipt.amount)}
                      </span>
                    </div>
                    {receipt.paymentMethod && (
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(receipt.paymentMethod)}
                        <span className="text-gray-600">
                          {getPaymentMethodText(receipt.paymentMethod)}
                          {receipt.paymentMethod.type === 'bank' && receipt.paymentMethod.bankName && (
                            <> - {receipt.paymentMethod.bankName}</>
                          )}
                          {receipt.paymentMethod.type === 'check' && receipt.paymentMethod.checkNumber && (
                            <> - شيك رقم: {receipt.paymentMethod.checkNumber}</>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {receipt.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">ملاحظات</h3>
                      <p className="text-gray-600">{receipt.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      onClick={() => {}}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-5 h-5" />
                      تحميل السند
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
};