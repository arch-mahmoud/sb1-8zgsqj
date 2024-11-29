import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Client } from '../types';
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
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { formatCurrency } from '../utils/invoiceUtils';
import { calculateTimeRemaining } from '../utils/dateUtils';

interface Props {
  client: Client;
  onBack: () => void;
}

export const ClientProfile: React.FC<Props> = ({ client, onBack }) => {
  const { projects, invoices, promissoryNotes, receipts } = useStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const clientData = useMemo(() => {
    const clientProjects = projects.filter(p => p.clientId === client.id);
    const clientInvoices = invoices.filter(i => i.clientId === client.id);
    const clientNotes = promissoryNotes.filter(n => n.clientId === client.id);
    const clientReceipts = receipts.filter(r => r.clientId === client.id);

    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = clientReceipts.reduce((sum, r) => sum + r.amount, 0);
    const balance = totalInvoiced - totalPaid;

    const activeNotes = clientNotes.filter(n => n.status === 'active');
    const totalNotesAmount = activeNotes.reduce((sum, note) => sum + note.amount, 0);

    return {
      projects: clientProjects,
      invoices: clientInvoices,
      notes: clientNotes,
      receipts: clientReceipts,
      stats: {
        totalProjects: clientProjects.length,
        activeProjects: clientProjects.filter(p => p.status === 'active').length,
        totalInvoices: clientInvoices.length,
        paidInvoices: clientInvoices.filter(i => i.status === 'paid').length,
        totalInvoiced,
        totalPaid,
        balance,
        activeNotes: activeNotes.length,
        totalNotesAmount,
        paymentStats: {
          cash: clientReceipts.filter(r => r.paymentMethod?.type === 'cash')
            .reduce((sum, r) => sum + r.amount, 0),
          bank: clientReceipts.filter(r => r.paymentMethod?.type === 'bank')
            .reduce((sum, r) => sum + r.amount, 0),
          check: clientReceipts.filter(r => r.paymentMethod?.type === 'check')
            .reduce((sum, r) => sum + r.amount, 0),
          pos: clientReceipts.filter(r => r.paymentMethod?.type === 'pos')
            .reduce((sum, r) => sum + r.amount, 0)
        }
      }
    };
  }, [client.id, projects, invoices, promissoryNotes, receipts]);

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

      {/* Client Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className={clsx(
            "p-3 rounded-lg",
            client.type === 'facility' ? "bg-purple-100" : "bg-blue-100"
          )}>
            <Building2 className={clsx(
              "w-6 h-6",
              client.type === 'facility' ? "text-purple-600" : "text-blue-600"
            )} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {client.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                {client.phone}
              </div>
              {client.type === 'facility' && client.facilityInfo && (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    سجل تجاري: {client.facilityInfo.commercialRegister}
                  </div>
                  {client.facilityInfo.vatNumber && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      الرقم الضريبي: {client.facilityInfo.vatNumber}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الفواتير</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي الفواتير</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(clientData.stats.totalInvoiced)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المدفوع</span>
              <span className="font-medium text-green-600">
                {formatCurrency(clientData.stats.totalPaid)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-700">المستحق</span>
              <span className={clsx(
                "font-medium",
                clientData.stats.balance > 0 ? "text-red-600" : "text-green-600"
              )}>
                {formatCurrency(clientData.stats.balance)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">السندات النشطة</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">عدد السندات</span>
              <span className="font-medium text-gray-900">
                {clientData.stats.activeNotes}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المبلغ</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(clientData.stats.totalNotesAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المشاريع</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المشاريع النشطة</span>
              <span className="font-medium text-gray-900">
                {clientData.stats.activeProjects}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المشاريع</span>
              <span className="font-medium text-gray-900">
                {clientData.stats.totalProjects}
              </span>
            </div>
          </div>
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
              {formatCurrency(clientData.stats.paymentStats.cash)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">تحويل بنكي</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(clientData.stats.paymentStats.bank)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">شيكات</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(clientData.stats.paymentStats.check)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">شبكة</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatCurrency(clientData.stats.paymentStats.pos)}
            </span>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div
          className="p-6 flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'invoices' ? null : 'invoices')}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">الفواتير</h3>
          </div>
          {expandedSection === 'invoices' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <AnimatePresence>
          {expandedSection === 'invoices' && (
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
                        رقم الفاتورة
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientData.invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.date).toLocaleDateString('ar-SA')}
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
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            invoice.status === 'draft' ? "bg-gray-100 text-gray-800" :
                            invoice.status === 'issued' ? "bg-blue-100 text-blue-800" :
                            invoice.status === 'paid' ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {invoice.status === 'draft' ? 'مسودة' :
                             invoice.status === 'issued' ? 'مصدرة' :
                             invoice.status === 'paid' ? 'مدفوعة' : 'ملغاة'}
                          </span>
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

      {/* Promissory Notes Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div
          className="p-6 flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'notes' ? null : 'notes')}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">السندات لأمر</h3>
          </div>
          {expandedSection === 'notes' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <AnimatePresence>
          {expandedSection === 'notes' && (
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
                        تاريخ الاستحقاق
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientData.notes.map((note) => (
                      <tr key={note.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {note.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(note.dueDate).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(note.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={clsx(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            note.status === 'active' ? "bg-blue-100 text-blue-800" :
                            note.status === 'paid' ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {note.status === 'active' ? 'نشط' :
                             note.status === 'paid' ? 'مدفوع' : 'ملغي'}
                          </span>
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

      {/* Receipts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div
          className="p-6 flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'receipts' ? null : 'receipts')}
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">سندات القبض</h3>
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
                    {clientData.receipts.map((receipt) => (
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