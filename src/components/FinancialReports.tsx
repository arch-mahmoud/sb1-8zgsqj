import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Building2, 
  Wallet,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { formatCurrency } from '../utils/invoiceUtils';
import * as XLSX from 'xlsx';

export const FinancialReports: React.FC = () => {
  const { clients, invoices, receipts, promissoryNotes } = useStore();
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const data = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredInvoices = invoices.filter(inv => 
      new Date(inv.date) >= startDate && new Date(inv.date) <= now
    );

    const filteredReceipts = receipts.filter(rec => 
      new Date(rec.date) >= startDate && new Date(rec.date) <= now
    );

    const totalInvoiced = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = filteredReceipts.reduce((sum, rec) => sum + rec.amount, 0);
    const totalVAT = filteredInvoices.reduce((sum, inv) => sum + inv.vatTotal, 0);

    const paymentMethods = [
      { 
        name: 'نقدي', 
        value: filteredReceipts.filter(r => r.paymentMethod?.type === 'cash')
          .reduce((sum, r) => sum + r.amount, 0)
      },
      {
        name: 'تحويل بنكي',
        value: filteredReceipts.filter(r => r.paymentMethod?.type === 'bank')
          .reduce((sum, r) => sum + r.amount, 0)
      },
      {
        name: 'شيكات',
        value: filteredReceipts.filter(r => r.paymentMethod?.type === 'check')
          .reduce((sum, r) => sum + r.amount, 0)
      },
      {
        name: 'شبكة',
        value: filteredReceipts.filter(r => r.paymentMethod?.type === 'pos')
          .reduce((sum, r) => sum + r.amount, 0)
      }
    ];

    // Monthly data for charts
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthInvoices = filteredInvoices.filter(inv => 
        new Date(inv.date).getMonth() === month.getMonth() &&
        new Date(inv.date).getFullYear() === month.getFullYear()
      );
      const monthReceipts = filteredReceipts.filter(rec =>
        new Date(rec.date).getMonth() === month.getMonth() &&
        new Date(rec.date).getFullYear() === month.getFullYear()
      );

      return {
        month: month.toLocaleDateString('ar-SA', { month: 'short' }),
        invoiced: monthInvoices.reduce((sum, inv) => sum + inv.total, 0),
        paid: monthReceipts.reduce((sum, rec) => sum + rec.amount, 0),
        vat: monthInvoices.reduce((sum, inv) => sum + inv.vatTotal, 0)
      };
    }).reverse();

    // Client statistics
    const clientStats = clients.map(client => {
      const clientInvoices = filteredInvoices.filter(inv => inv.clientId === client.id);
      const clientReceipts = filteredReceipts.filter(rec => rec.clientId === client.id);
      
      return {
        name: client.name,
        invoiced: clientInvoices.reduce((sum, inv) => sum + inv.total, 0),
        paid: clientReceipts.reduce((sum, rec) => sum + rec.amount, 0),
        balance: clientInvoices.reduce((sum, inv) => sum + inv.total, 0) -
                clientReceipts.reduce((sum, rec) => sum + rec.amount, 0)
      };
    }).sort((a, b) => b.invoiced - a.invoiced);

    return {
      summary: {
        totalInvoiced,
        totalPaid,
        totalVAT,
        outstandingBalance: totalInvoiced - totalPaid,
        paymentMethods
      },
      monthlyData,
      clientStats
    };
  }, [clients, invoices, receipts, dateRange]);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['الملخص المالي', ''],
      ['إجمالي الفواتير', formatCurrency(data.summary.totalInvoiced)],
      ['إجمالي المدفوعات', formatCurrency(data.summary.totalPaid)],
      ['إجمالي الضريبة', formatCurrency(data.summary.totalVAT)],
      ['الرصيد المستحق', formatCurrency(data.summary.outstandingBalance)],
      ['', ''],
      ['طرق الدفع', ''],
      ...data.summary.paymentMethods.map(method => [
        method.name,
        formatCurrency(method.value)
      ])
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'الملخص');

    // Monthly Data Sheet
    const monthlySheet = XLSX.utils.json_to_sheet(data.monthlyData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'البيانات الشهرية');

    // Client Statistics Sheet
    const clientSheet = XLSX.utils.json_to_sheet(data.clientStats);
    XLSX.utils.book_append_sheet(workbook, clientSheet, 'إحصائيات العملاء');

    XLSX.writeFile(workbook, `التقرير_المالي_${new Date().toLocaleDateString('ar-SA')}.xlsx`);
  };

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">التقارير المالية</h2>
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="rounded-lg border-gray-300 text-gray-700"
          >
            <option value="month">آخر شهر</option>
            <option value="quarter">آخر 3 شهور</option>
            <option value="year">آخر سنة</option>
          </select>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الفواتير</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data.summary.totalInvoiced)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي المدفوعات</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data.summary.totalPaid)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي الضريبة</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data.summary.totalVAT)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">الرصيد المستحق</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatCurrency(data.summary.outstandingBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">توزيع طرق الدفع</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.summary.paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.summary.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">التحليل الشهري</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="invoiced" name="الفواتير" fill="#3b82f6" />
              <Bar dataKey="paid" name="المدفوعات" fill="#22c55e" />
              <Bar dataKey="vat" name="الضريبة" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">إحصائيات العملاء</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجمالي الفواتير
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المدفوع
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستحق
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.clientStats.map((client, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(client.invoiced)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(client.paid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(client.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};