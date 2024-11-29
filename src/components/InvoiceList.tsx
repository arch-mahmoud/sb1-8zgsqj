import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/invoiceUtils';
import { FileText, Search, Filter, CheckCircle2, Clock, AlertTriangle, Download, Receipt, X, Building2, Calendar, Mail, Phone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const InvoiceList: React.FC = () => {
  const { invoices, clients, projects, markAsPaid, receipts, activateInvoice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'issued' | 'paid' | 'cancelled'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<string | null>(null);
  const [showActivateModal, setShowActivateModal] = useState<string | null>(null);

  const handleInvoiceClick = (invoiceId: string) => {
    setSelectedInvoice(invoiceId);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const client = clients.find(c => c.id === invoice.clientId);
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.items.some(item => 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter = filter === 'all' || invoice.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'issued': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'issued': return <FileText className="w-4 h-4" />;
      case 'paid': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'issued': return 'مصدرة';
      case 'paid': return 'مدفوعة';
      case 'cancelled': return 'ملغاة';
      default: return status;
    }
  };

  const isOverdue = (invoice: typeof invoices[0]) => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return false;
    return new Date(invoice.dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في الفواتير..."
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
            onClick={() => setFilter('draft')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'draft'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            مسودة
          </button>
          <button
            onClick={() => setFilter('issued')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'issued'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            مصدرة
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'paid'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            مدفوعة
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الفاتورة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المشاريع
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  سند القبض
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">تحميل</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence mode="popLayout">
                {filteredInvoices.map((invoice) => {
                  const client = clients.find(c => c.id === invoice.clientId);
                  const invoiceProjects = invoice.items
                    .map(item => projects.find(p => p.id === item.projectId))
                    .filter(Boolean);

                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleInvoiceClick(invoice.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {invoiceProjects.map(project => project?.title).join('، ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(invoice.date).toLocaleDateString('ar-SA')}
                        </div>
                        {isOverdue(invoice) && (
                          <div className="text-sm text-red-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-4 h-4" />
                            متأخرة
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          شامل {formatCurrency(invoice.vatTotal)} ضريبة
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getStatusColor(invoice.status)
                        )}>
                          {getStatusIcon(invoice.status)}
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.status === 'paid' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const receipt = receipts.find(r => r.invoiceId === invoice.id);
                              if (receipt) {
                                setShowReceiptModal(receipt.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-700"
                          >
                            <Receipt className="w-4 h-4" />
                            <span className="text-sm">عرض السند</span>
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <div onClick={(e) => e.stopPropagation()}>
                            {invoice.status === 'draft' && (
                              <button
                                onClick={() => setShowActivateModal(invoice.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="تفعيل الفاتورة"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}
                            {invoice.status === 'issued' && (
                              <button
                                onClick={() => setShowPaymentModal(invoice.id)}
                                className="text-green-600 hover:text-green-900"
                                title="تسجيل الدفع"
                              >
                                <Receipt className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => {}}
                              className="text-blue-600 hover:text-blue-900"
                              title="تحميل الفاتورة"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد فواتير مطابقة للبحث</p>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {(() => {
              const invoice = invoices.find(i => i.id === selectedInvoice);
              const client = clients.find(c => c?.id === invoice?.clientId);
              if (!invoice || !client) return null;

              return (
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        فاتورة رقم {invoice.number}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        تاريخ الإصدار: {new Date(invoice.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{client.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">{client.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Status */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة الفاتورة</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                            getStatusColor(invoice.status)
                          )}>
                            {getStatusIcon(invoice.status)}
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            تاريخ الاستحقاق: {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">بنود الفاتورة</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">البند</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">الكمية</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">السعر</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500">المجموع</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {invoice.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{item.description}</div>
                                {item.projectId && (
                                  <div className="text-sm text-gray-500">
                                    {projects.find(p => p.id === item.projectId)?.title}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatCurrency(item.unitPrice)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatCurrency(item.totalWithVat)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  شامل {formatCurrency(item.vatAmount)} ضريبة
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-left">
                              المجموع قبل الضريبة
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {formatCurrency(invoice.subtotal)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-left">
                              ضريبة القيمة المضافة (15%)
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {formatCurrency(invoice.vatTotal)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-lg font-bold text-gray-900 text-left">
                              الإجمالي
                            </td>
                            <td className="px-6 py-4 text-lg font-bold text-blue-600">
                              {formatCurrency(invoice.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(invoice.notes || invoice.bankAccount) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {invoice.notes && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">ملاحظات</h3>
                          <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                      )}
                      {invoice.bankAccount && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">معلومات الحساب البنكي</h3>
                          <div className="space-y-2">
                            <p className="text-gray-600">البنك: {invoice.bankAccount.bankName}</p>
                            <p className="text-gray-600">رقم الحساب: {invoice.bankAccount.accountNumber}</p>
                            <p className="text-gray-600">IBAN: {invoice.bankAccount.iban}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                    {invoice.status === 'issued' && (
                      <button
                        onClick={() => {
                          setShowPaymentModal(invoice.id);
                          setSelectedInvoice(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Receipt className="w-5 h-5" />
                        تسجيل الدفع
                      </button>
                    )}
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => {
                          setShowActivateModal(invoice.id);
                          setSelectedInvoice(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        تفعيل الفاتورة
                      </button>
                    )}
                    <button
                      onClick={() => {}}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-5 h-5" />
                      تحميل الفاتورة
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تأكيد الدفع</h3>
            <p className="text-gray-600 mb-6">
              هل تريد تسجيل هذه الفاتورة كمدفوعة؟ سيتم إنشاء سند قبض تلقائياً.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  markAsPaid(showPaymentModal);
                  setShowPaymentModal(null);
                }}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                تأكيد الدفع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Invoice Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تفعيل الفاتورة</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من تفعيل هذه الفاتورة؟ لن تتمكن من تعديلها بعد التفعيل.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowActivateModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  activateInvoice(showActivateModal);
                  setShowActivateModal(null);
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                تفعيل الفاتورة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full mx-4"
          >
            {(() => {
              const receipt = receipts.find(r => r.id === showReceiptModal);
              const invoice = invoices.find(i => i.id === receipt?.invoiceId);
              const client = clients.find(c => c.id === receipt?.clientId);
              if (!receipt || !invoice || !client) return null;

              return (
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        سند قبض رقم {receipt.number}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        تاريخ السند: {new Date(receipt.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowReceiptModal(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">فاتورة رقم: {invoice.number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-900">المبلغ: {formatCurrency(receipt.amount)}</span>
                    </div>
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