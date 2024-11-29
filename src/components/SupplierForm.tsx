import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Building2, Mail, Phone, UserPlus, CreditCard } from 'lucide-react';

export const SupplierForm: React.FC = () => {
  const { addSupplier } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'individual' as const,
    commercialRegister: '',
    vatNumber: '',
    category: [] as string[],
    notes: '',
    bankInfo: {
      bankName: '',
      accountNumber: '',
      iban: ''
    },
    contactPerson: {
      name: '',
      phone: '',
      email: '',
      position: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'individual',
      commercialRegister: '',
      vatNumber: '',
      category: [],
      notes: '',
      bankInfo: {
        bankName: '',
        accountNumber: '',
        iban: ''
      },
      contactPerson: {
        name: '',
        phone: '',
        email: '',
        position: ''
      }
    });
  };

  const categories = [
    'مواد بناء',
    'معدات',
    'خدمات',
    'مقاولات',
    'توريدات كهربائية',
    'توريدات ميكانيكية',
    'أخرى'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">المعلومات الأساسية</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              اسم المورد
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              نوع المورد
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'company' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="individual">فرد</option>
              <option value="company">شركة</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              العنوان
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Company Information */}
      {formData.type === 'company' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات الشركة</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                السجل التجاري
              </label>
              <input
                type="text"
                value={formData.commercialRegister}
                onChange={(e) => setFormData({ ...formData, commercialRegister: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                الرقم الضريبي
              </label>
              <input
                type="text"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيفات
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.category.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            category: [...formData.category, category]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            category: formData.category.filter(c => c !== category)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Person */}
      {formData.type === 'company' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات المسؤول</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                اسم المسؤول
              </label>
              <input
                type="text"
                value={formData.contactPerson.name}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, name: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                المنصب
              </label>
              <input
                type="text"
                value={formData.contactPerson.position}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, position: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                رقم الجوال
              </label>
              <input
                type="tel"
                value={formData.contactPerson.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, phone: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.contactPerson.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, email: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bank Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">المعلومات البنكية</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              اسم البنك
            </label>
            <input
              type="text"
              value={formData.bankInfo.bankName}
              onChange={(e) => setFormData({
                ...formData,
                bankInfo: { ...formData.bankInfo, bankName: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              رقم الحساب
            </label>
            <input
              type="text"
              value={formData.bankInfo.accountNumber}
              onChange={(e) => setFormData({
                ...formData,
                bankInfo: { ...formData.bankInfo, accountNumber: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              IBAN
            </label>
            <input
              type="text"
              value={formData.bankInfo.iban}
              onChange={(e) => setFormData({
                ...formData,
                bankInfo: { ...formData.bankInfo, iban: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              pattern="SA[0-9]{22}"
              placeholder="SA0000000000000000000000"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">ملاحظات إضافية</h3>
        </div>

        <div>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="أي ملاحظات إضافية..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <UserPlus className="w-5 h-5" />
          إضافة المورد
        </button>
      </div>
    </form>
  );
};