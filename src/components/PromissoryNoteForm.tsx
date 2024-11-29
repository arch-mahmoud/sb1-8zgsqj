import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { FileText, Building2, Calendar, Calculator, Plus, Trash2, Download, ChevronDown, ChevronUp, Clock, Check } from 'lucide-react';
import { formatCurrency } from '../utils/invoiceUtils';
import { downloadPromissoryNote } from '../utils/pdfUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const PromissoryNoteForm: React.FC = () => {
  const { clients, addPromissoryNote, promissoryNotes, payPromissoryNote, cancelPromissoryNote } = useStore();
  const [clientId, setClientId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [numberOfNotes, setNumberOfNotes] = useState(1);
  const [monthsBetweenNotes, setMonthsBetweenNotes] = useState(1);
  const [notes, setNotes] = useState('');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const installments = useMemo(() => {
    if (!startDate || !totalAmount || numberOfNotes < 1) return [];

    const amount = parseFloat(totalAmount);
    if (isNaN(amount)) return [];

    const installmentAmount = Math.round((amount / numberOfNotes) * 100) / 100;
    const startDateObj = new Date(startDate);
    
    return Array.from({ length: numberOfNotes }, (_, index) => {
      const dueDate = new Date(startDateObj);
      dueDate.setMonth(dueDate.getMonth() + (index * monthsBetweenNotes));
      
      return {
        number: index + 1,
        amount: index === numberOfNotes - 1 
          ? amount - (installmentAmount * (numberOfNotes - 1)) // Last installment gets remainder
          : installmentAmount,
        dueDate
      };
    });
  }, [startDate, totalAmount, numberOfNotes, monthsBetweenNotes]);

  const clientNotes = useMemo(() => {
    const groupedNotes = new Map();
    promissoryNotes.forEach(note => {
      const client = clients.find(c => c.id === note.clientId);
      if (!client) return;

      if (!groupedNotes.has(client.id)) {
        groupedNotes.set(client.id, {
          client,
          notes: []
        });
      }
      groupedNotes.get(client.id).notes.push(note);
    });
    return Array.from(groupedNotes.values());
  }, [promissoryNotes, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !totalAmount || !startDate || numberOfNotes < 1) return;

    // Create a promissory note for each installment
    installments.forEach(installment => {
      addPromissoryNote({
        clientId,
        amount: installment.amount,
        date: new Date(),
        dueDate: installment.dueDate,
        notes: `قسط ${installment.number} من ${numberOfNotes} - ${notes}`.trim()
      });
    });

    // Reset form
    setClientId('');
    setTotalAmount('');
    setStartDate('');
    setNumberOfNotes(1);
    setMonthsBetweenNotes(1);
    setNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                إجمالي المبلغ
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                تاريخ أول قسط
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                عدد السندات
              </label>
              <input
                type="number"
                min="1"
                value={numberOfNotes}
                onChange={(e) => setNumberOfNotes(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                عدد الأشهر بين كل قسط
              </label>
              <input
                type="number"
                min="1"
                value={monthsBetweenNotes}
                onChange={(e) => setMonthsBetweenNotes(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
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

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            إنشاء السندات
          </button>
        </form>
      </div>

      {/* Preview Section */}
      {installments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة السندات</h3>
          <div className="space-y-4">
            {installments.map((installment, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      قسط {installment.number} من {numberOfNotes}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      تاريخ الاستحقاق: {installment.dueDate.toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatCurrency(installment.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">السندات المنشأة</h3>
          
          <div className="space-y-4">
            {clientNotes.map(({ client, notes }) => (
              <div key={client.id} className="border rounded-lg">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                      <p className="text-sm text-gray-500">
                        {notes.length} سند
                      </p>
                    </div>
                  </div>
                  {expandedClient === client.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedClient === client.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
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
                                المبلغ
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                تاريخ الاستحقاق
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">إجراءات</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {notes.map((note) => (
                              <tr key={note.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {note.number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {formatCurrency(note.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(note.dueDate).toLocaleDateString('ar-SA')}
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => downloadPromissoryNote(note, client)}
                                      className="text-blue-600 hover:text-blue-900"
                                      title="تحميل السند"
                                    >
                                      <Download className="w-5 h-5" />
                                    </button>
                                    {note.status === 'active' && (
                                      <>
                                        <button
                                          onClick={() => payPromissoryNote(note.id)}
                                          className="text-green-600 hover:text-green-900"
                                          title="تسجيل الدفع"
                                        >
                                          <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                          onClick={() => cancelPromissoryNote(note.id)}
                                          className="text-red-600 hover:text-red-900"
                                          title="إلغاء السند"
                                        >
                                          <Trash2 className="w-5 h-5" />
                                        </button>
                                      </>
                                    )}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};