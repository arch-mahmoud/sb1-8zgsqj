import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SupplierProfile } from './SupplierProfile';
import { Building2, Mail, Phone, Search, Truck, UserCircle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { formatCurrency } from '../utils/invoiceUtils';

export const SupplierList: React.FC = () => {
  const { suppliers, getSupplierBalance } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'individual' | 'company'>('all');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm);

    const matchesFilter = filter === 'all' || supplier.type === filter;

    return matchesSearch && matchesFilter;
  });

  if (selectedSupplier) {
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (!supplier) return null;
    return <SupplierProfile supplier={supplier} onBack={() => setSelectedSupplier(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في الموردين..."
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
            onClick={() => setFilter('individual')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'individual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            أفراد
          </button>
          <button
            onClick={() => setFilter('company')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === 'company'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            شركات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSuppliers.map((supplier) => {
            const balance = getSupplierBalance(supplier.id);
            
            return (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedSupplier(supplier.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    "p-3 rounded-lg",
                    supplier.type === 'company' ? "bg-purple-100" : "bg-blue-100"
                  )}>
                    {supplier.type === 'company' ? (
                      <Building2 className="w-6 h-6 text-purple-600" />
                    ) : (
                      <UserCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {supplier.phone}
                      </div>
                      {supplier.type === 'company' && supplier.commercialRegister && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          {supplier.commercialRegister}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">إجمالي المشتريات:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(balance.totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">المدفوع:</span>
                      <span className="font-medium text-green-600">{formatCurrency(balance.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium text-gray-700">المستحق:</span>
                      <span className={clsx(
                        "font-medium",
                        balance.balance > 0 ? "text-red-600" : "text-green-600"
                      )}>
                        {formatCurrency(balance.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا يوجد موردين مطابقين للبحث</p>
        </div>
      )}
    </div>
  );
};