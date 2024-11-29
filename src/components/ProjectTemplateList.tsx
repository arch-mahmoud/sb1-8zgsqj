import React from 'react';
import { useStore } from '../store/useStore';
import { Copy, FolderPlus, Trash2 } from 'lucide-react';

export const ProjectTemplateList: React.FC = () => {
  const { templates, createProjectFromTemplate, deleteTemplate, users } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Copy className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => createProjectFromTemplate(template.id)}
                className="text-blue-600 hover:text-blue-900"
                title="إنشاء مشروع من القالب"
              >
                <FolderPlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="text-red-600 hover:text-red-900"
                title="حذف القالب"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              المهام ({template.tasks.length})
            </h4>
            <div className="space-y-2">
              {template.tasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  {task.assignedTo.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {task.assignedTo.map((userId) => {
                        const user = users.find(u => u.id === userId);
                        return user ? (
                          <span
                            key={userId}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {user.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  {task.dependsOn.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      يعتمد على: {task.dependsOn.map(depIndex => {
                        const depTask = template.tasks[parseInt(depIndex)];
                        return depTask?.title;
                      }).filter(Boolean).join('، ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            تم الإنشاء: {new Date(template.createdAt).toLocaleDateString('ar-SA')}
          </div>
        </div>
      ))}
    </div>
  );
};