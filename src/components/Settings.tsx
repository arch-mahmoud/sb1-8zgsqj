import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Upload, Download, Settings as SettingsIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

export const Settings: React.FC = () => {
  const { 
    currentUser, 
    updateSettings, 
    settings,
    users,
    templates,
    projects,
    addUser,
    addTemplate,
    addProject
  } = useStore();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [maxFileSize, setMaxFileSize] = useState(settings.maxFileSize / (1024 * 1024)); // Convert to MB
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (currentUser?.role !== 'manager') {
    return null;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewLogo(result);
      updateSettings({ logo: result });
    };
    reader.readAsDataURL(file);
  };

  const handleMaxFileSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseFloat(e.target.value);
    if (!isNaN(size) && size > 0) {
      setMaxFileSize(size);
      updateSettings({ maxFileSize: size * 1024 * 1024 }); // Convert MB to bytes
    }
  };

  const exportData = () => {
    const workbook = XLSX.utils.book_new();

    // Export Users
    const usersWS = XLSX.utils.json_to_sheet(users.map(user => ({
      ...user,
      joinDate: new Date(user.joinDate).toLocaleDateString('ar-SA')
    })));
    XLSX.utils.book_append_sheet(workbook, usersWS, 'الموظفين');

    // Export Templates
    const templatesWS = XLSX.utils.json_to_sheet(templates.map(template => ({
      ...template,
      tasks: JSON.stringify(template.tasks),
      createdAt: new Date(template.createdAt).toLocaleDateString('ar-SA'),
      updatedAt: new Date(template.updatedAt).toLocaleDateString('ar-SA')
    })));
    XLSX.utils.book_append_sheet(workbook, templatesWS, 'القوالب');

    // Export Projects
    const projectsWS = XLSX.utils.json_to_sheet(projects.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt).toLocaleDateString('ar-SA'),
      updatedAt: new Date(project.updatedAt).toLocaleDateString('ar-SA')
    })));
    XLSX.utils.book_append_sheet(workbook, projectsWS, 'المشاريع');

    XLSX.writeFile(workbook, 'system-data.xlsx');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: 'binary' });

      // Import Users
      const usersSheet = workbook.Sheets['الموظفين'];
      if (usersSheet) {
        const users = XLSX.utils.sheet_to_json(usersSheet);
        users.forEach((user: any) => {
          addUser({
            ...user,
            joinDate: new Date(user.joinDate)
          });
        });
      }

      // Import Templates
      const templatesSheet = workbook.Sheets['القوالب'];
      if (templatesSheet) {
        const templates = XLSX.utils.sheet_to_json(templatesSheet);
        templates.forEach((template: any) => {
          addTemplate({
            ...template,
            tasks: JSON.parse(template.tasks)
          });
        });
      }

      // Import Projects
      const projectsSheet = workbook.Sheets['المشاريع'];
      if (projectsSheet) {
        const projects = XLSX.utils.sheet_to_json(projectsSheet);
        projects.forEach((project: any) => {
          addProject({
            title: project.title,
            description: project.description
          });
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      {/* Logo Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">الشعار</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                شعار النظام
              </label>
              <div className="mt-2 flex items-center gap-4">
                <img
                  src={previewLogo || settings.logo}
                  alt="الشعار"
                  className="h-16 object-contain"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  تغيير الشعار
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Size Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">إعدادات المرفقات</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                الحجم الأقصى للمرفقات (ميجابايت)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
                <input
                  type="number"
                  value={maxFileSize}
                  onChange={handleMaxFileSizeChange}
                  min="1"
                  step="1"
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">MB</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                الحد الأقصى المسموح به لحجم المرفقات في المهام
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Import/Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">استيراد وتصدير البيانات</h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              تصدير البيانات
            </button>
            <div>
              <input
                type="file"
                onChange={importData}
                accept=".xlsx"
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                استيراد البيانات
              </label>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            يمكنك تصدير واستيراد بيانات الموظفين والقوالب والمشاريع
          </p>
        </div>
      </div>
    </div>
  );
};