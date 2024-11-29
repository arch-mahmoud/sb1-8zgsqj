import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Client } from '../types';
import { UserPlus, Edit2, Trash2, Users, Building2, Phone, Mail, Upload, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTimeRemaining, calculateAge } from '../utils/dateUtils';
import { clsx } from 'clsx';

export const ClientManagement: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, projects } = useStore();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const initialClientState = {
    name: '',
    email: '',
    phone: '',
    type: 'individual' as const,
    address: '',
    registrationType: 'direct' as const,
    facilityInfo: {
      commercialRegister: '',
      registerExpiry: '',
      vatNumber: '',
      authorizedPerson: {
        name: '',
        idNumber: '',
        phone: '',
        gender: 'male' as const,
        title: '',
      }
    },
    directInfo: {
      idNumber: '',
      birthDate: '',
      age: 0,
      gender: 'male' as const,
    },
    agent: {
      name: '',
      gender: 'male' as const,
      powerOfAttorneyNumber: '',
      powerOfAttorneyExpiry: '',
      type: 'individual' as const,
    },
    principals: [{
      name: '',
      idNumber: '',
      birthDate: '',
      gender: 'male' as const,
    }],
  };
  
  const [newClient, setNewClient] = useState(initialClientState);
  const [principalCount, setPrincipalCount] = useState(1);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Add proper prefix based on client type
    const nameWithPrefix = newClient.type === 'facility' 
      ? `السادة/ ${newClient.name}`
      : newClient.type === 'individual' && newClient.directInfo?.gender === 'female'
      ? `السيدة/ ${newClient.name}`
      : `السيد/ ${newClient.name}`;

    const clientData = {
      ...newClient,
      name: nameWithPrefix,
    };

    addClient(clientData);
    setIsAddingClient(false);
    setNewClient(initialClientState);
    setPrincipalCount(1);
  };

  const handlePrincipalCountChange = (count: number) => {
    setPrincipalCount(count);
    setNewClient(prev => ({
      ...prev,
      principals: Array(count).fill(0).map((_, i) => prev.principals[i] || {
        name: '',
        idNumber: '',
        birthDate: '',
        gender: 'male' as const,
      }),
    }));
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    updateClient(editingClient.id, editingClient);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">إدارة العملاء</h2>
        <button
          onClick={() => setIsAddingClient(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5" />
          تسجيل عميل جديد
        </button>
      </div>

      {isAddingClient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <form onSubmit={handleAddClient} className="space-y-4">
            <div className="space-y-6">
              {/* Client Type Selection */}
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newClient.type === 'individual'}
                    onChange={() => setNewClient({ ...newClient, type: 'individual' })}
                    className="ml-2"
                  />
                  فرد
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newClient.type === 'facility'}
                    onChange={() => setNewClient({ ...newClient, type: 'facility' })}
                    className="ml-2"
                  />
                  منشأة
                </label>
              </div>

              {/* Facility Information */}
              {newClient.type === 'facility' && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900">معلومات المنشأة</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        اسم المنشأة (سيضاف السادة/ تلقائياً)
                      </label>
                      <input
                        type="text"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        رقم السجل التجاري
                      </label>
                      <input
                        type="text"
                        value={newClient.facilityInfo?.commercialRegister}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!, 
                            commercialRegister: e.target.value 
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        الرقم الضريبي
                      </label>
                      <input
                        type="text"
                        pattern="\d{15}"
                        maxLength={15}
                        value={newClient.facilityInfo?.vatNumber || ''}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!, 
                            vatNumber: e.target.value 
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        placeholder="300000000000003"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        يجب أن يتكون الرقم الضريبي من 15 رقم
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        تاريخ انتهاء السجل
                      </label>
                      <input
                        type="date"
                        value={newClient.facilityInfo?.registerExpiry}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!, 
                            registerExpiry: e.target.value 
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mt-6">معلومات المفوض</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        اسم المفوض
                      </label>
                      <input
                        type="text"
                        value={newClient.facilityInfo?.authorizedPerson.name}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!,
                            authorizedPerson: {
                              ...newClient.facilityInfo!.authorizedPerson,
                              name: e.target.value
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        الصفة
                      </label>
                      <input
                        type="text"
                        value={newClient.facilityInfo?.authorizedPerson.title}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!,
                            authorizedPerson: {
                              ...newClient.facilityInfo!.authorizedPerson,
                              title: e.target.value
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        رقم الهوية
                      </label>
                      <input
                        type="text"
                        value={newClient.facilityInfo?.authorizedPerson.idNumber}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!,
                            authorizedPerson: {
                              ...newClient.facilityInfo!.authorizedPerson,
                              idNumber: e.target.value
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        رقم الجوال
                      </label>
                      <input
                        type="tel"
                        value={newClient.facilityInfo?.authorizedPerson.phone}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!,
                            authorizedPerson: {
                              ...newClient.facilityInfo!.authorizedPerson,
                              phone: e.target.value
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        الجنس
                      </label>
                      <select
                        value={newClient.facilityInfo?.authorizedPerson.gender}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          facilityInfo: { 
                            ...newClient.facilityInfo!,
                            authorizedPerson: {
                              ...newClient.facilityInfo!.authorizedPerson,
                              gender: e.target.value as 'male' | 'female'
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Information */}
              {newClient.type === 'individual' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      اسم العميل
                    </label>
                    <input
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingClient(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {clients.map((client) => {
            const clientProjects = projects.filter(p => client.projects.includes(p.id));
            
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{client.name}</h3>
                      {client.type === 'facility' && client.facilityInfo && (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4" />
                            سجل تجاري: {client.facilityInfo.commercialRegister}
                          </div>
                          {client.facilityInfo.registerExpiry && (
                            <div className="mt-1">
                              {(() => {
                                const remaining = calculateTimeRemaining(new Date(client.facilityInfo!.registerExpiry));
                                if (remaining.expired) {
                                  return <span className="text-sm text-red-600">السجل منتهي</span>;
                                }
                                return (
                                  <span className={clsx(
                                    "text-sm",
                                    remaining.totalDays <= 30 ? "text-red-600" : "text-green-600"
                                  )}>
                                    متبقي: {remaining.years > 0 ? `${remaining.years} سنة ` : ''}
                                    {remaining.months > 0 ? `${remaining.months} شهر ` : ''}
                                    {remaining.days > 0 ? `${remaining.days} يوم` : ''}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          <div className="mt-2 text-sm text-gray-600">
                            <div>المفوض: {client.facilityInfo.authorizedPerson.name}</div>
                            <div>الصفة: {client.facilityInfo.authorizedPerson.title}</div>
                          </div>
                        </>
                      )}
                      {client.type === 'individual' && (
                        <>
                          {client.registrationType === 'direct' && client.directInfo && (
                            <div className="text-sm text-gray-600">
                              <div>رقم الهوية: {client.directInfo.idNumber}</div>
                              <div>العمر: {client.directInfo.age} سنة</div>
                            </div>
                          )}
                          {client.registrationType === 'agent' && client.agent && (
                            <div className="text-sm text-gray-600">
                              <div>الوكيل: {client.agent.name}</div>
                              <div>رقم الوكالة: {client.agent.powerOfAttorneyNumber}</div>
                              {client.agent.powerOfAttorneyExpiry && (
                                <div className="mt-1">
                                  {(() => {
                                    const remaining = calculateTimeRemaining(new Date(client.agent.powerOfAttorneyExpiry));
                                    if (remaining.expired) {
                                      return <span className="text-red-600">الوكالة منتهية</span>;
                                    }
                                    return (
                                      <span className={clsx(
                                        remaining.totalDays <= 30 ? "text-red-600" : "text-green-600"
                                      )}>
                                        متبقي: {remaining.years > 0 ? `${remaining.years} سنة ` : ''}
                                        {remaining.months > 0 ? `${remaining.months} شهر ` : ''}
                                        {remaining.days > 0 ? `${remaining.days} يوم` : ''}
                                      </span>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              تعديل بيانات العميل
            </h3>
            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  اسم العميل
                </label>
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  العنوان
                </label>
                <input
                  type="text"
                  value={editingClient.address}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};