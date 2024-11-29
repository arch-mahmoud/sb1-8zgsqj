import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { FolderPlus, Copy, Building2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const ProjectForm: React.FC = () => {
  const { addProject, templates, createProjectFromTemplate, clients } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showTemplates, setShowTemplates] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedClient) return;

    if (selectedTemplate) {
      createProjectFromTemplate(selectedTemplate, selectedClient);
    } else {
      addProject({
        title,
        description,
        clientId: selectedClient,
      });
    }

    setTitle('');
    setDescription('');
    setSelectedClient('');
    setSelectedTemplate('');
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.title);
      setDescription(template.description);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إنشاء مشروع جديد</h2>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            showTemplates
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          <Copy className="w-4 h-4" />
          {showTemplates ? "إخفاء القوالب" : "عرض القوالب"}
        </button>
      </div>

      <AnimatePresence>
        {showTemplates && templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={clsx(
                    "group cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg",
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      "p-3 rounded-lg transition-all duration-300 group-hover:scale-110",
                      selectedTemplate === template.id
                        ? "bg-blue-100"
                        : "bg-gray-100 group-hover:bg-blue-50"
                    )}>
                      <Copy className={clsx(
                        "w-6 h-6",
                        selectedTemplate === template.id
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-blue-500"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {template.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {template.tasks.length} مهمة
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العميل
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              اسم المشروع
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              وصف المشروع
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            {selectedTemplate ? 'إنشاء مشروع من القالب' : 'إضافة مشروع جديد'}
          </button>
        </form>
      </div>
    </div>
  );
};