import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ClientProfile } from './ClientProfile';
import { Building2, Mail, Phone, Calendar, Search, Users, UserCircle, UserPlus, Star, Briefcase, Clock, AlertCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { calculateTimeRemaining } from '../utils/dateUtils';
import { formatCurrency } from '../utils/invoiceUtils';

export const ClientsList: React.FC = () => {
  const { clients, projects, invoices, promissoryNotes, receipts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const getClientStats = (clientId: string) => {
    const clientProjects = projects.filter(p => p.clientId === clientId);
    const clientInvoices = invoices.filter(i => i.clientId === clientId);
    const clientNotes = promissoryNotes.filter(n => n.clientId === clientId);
    const clientReceipts = receipts.filter(r => r.clientId === clientId);

    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = clientReceipts.reduce((sum, r) => sum + r.amount, 0);
    const balance = totalInvoiced - totalPaid;

    const activeNotes = clientNotes.filter(n => n.status === 'active');
    const totalNotesAmount = activeNotes.reduce((sum, note) => sum + note.amount, 0);

    return {
      totalProjects: clientProjects.length,
      activeProjects: clientProjects.filter(p => p.status === 'active').length,
      totalInvoices: clientInvoices.length,
      paidInvoices: clientInvoices.filter(i => i.status === 'paid').length,
      totalInvoiced,
      totalPaid,
      balance,
      activeNotes: activeNotes.length,
      totalNotesAmount
    };
  };

  if (selectedClient) {
    const client = clients.find(c => c.id === selectedClient);
    if (!client) return null;
    return <ClientProfile client={client} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في العملاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredClients.map((client) => {
            const stats = getClientStats(client.id);
            
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedClient(client.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    "p-3 rounded-lg",
                    client.type === 'facility' ? "bg-purple-100" : "bg-blue-100"
                  )}>
                    {client.type === 'facility' ? (
                      <Building2 className="w-6 h-6 text-purple-600" />
                    ) : (
                      <UserCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">المشاريع</div>
                      <div className="mt-1 font-medium text-gray-900">
                        {stats.activeProjects} / {stats.totalProjects}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">الفواتير</div>
                      <div className="mt-1 font-medium text-gray-900">
                        {stats.paidInvoices} / {stats.totalInvoices}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">إجمالي الفواتير:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(stats.totalInvoiced)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">المدفوع:</span>
                      <span className="font-medium text-green-600">{formatCurrency(stats.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium text-gray-700">المستحق:</span>
                      <span className={clsx(
                        "font-medium",
                        stats.balance > 0 ? "text-red-600" : "text-green-600"
                      )}>
                        {formatCurrency(stats.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا يوجد عملاء مطابقين للبحث</p>
        </div>
      )}
    </div>
  );
};