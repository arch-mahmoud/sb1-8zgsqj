import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ProjectTemplate, TaskTemplate } from '../types';
import { Plus, Trash2, Copy, FolderPlus, Users, Clock, CheckCircle2, ArrowRight, Building2, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const ProjectTemplates: React.FC = () => {
  const { templates, addTemplate, deleteTemplate, createProjectFromTemplate, users } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<TaskTemplate[]>([]);
  const [newTask, setNewTask] = useState<TaskTemplate>({
    title: '',
    description: '',
    estimatedDuration: undefined,
    requiredDepartments: [],
    dependsOn: [],
    assignedTo: [],
  });

  const departments = ['التصميم المعماري', 'الهندسة الإنشائية', 'الهندسة الكهربائية', 'الهندسة الميكانيكية'];
  const employees = users.filter(user => user.role === 'employee' && user.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTemplate({
      title,
      description,
      tasks,
    });

    setIsCreating(false);
    setTitle('');
    setDescription('');
    setTasks([]);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    setTasks([...tasks, { ...newTask }]);
    setNewTask({
      title: '',
      description: '',
      estimatedDuration: undefined,
      requiredDepartments: [],
      dependsOn: [],
      assignedTo: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Copy className="w-8 h-8 text-blue-600" />
            قوالب المشاريع
          </h2>
          <p className="text-gray-500 mt-2">قوالب جاهزة لإنشاء المشاريع بشكل سريع وفعال مع إمكانية تخصيص المهام والموظفين</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            إضافة قالب جديد
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                اسم القالب
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                وصف القالب
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">المهام</h3>
              
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        {task.estimatedDuration && (
                          <p className="text-sm text-gray-500 mt-1">
                            المدة المتوقعة: {task.estimatedDuration} يوم
                          </p>
                        )}
                        {task.requiredDepartments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {task.requiredDepartments.map((dept) => (
                              <span
                                key={dept}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {dept}
                              </span>
                            ))}
                          </div>
                        )}
                        {task.assignedTo.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">الموظفون المعينون:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {task.assignedTo.map((userId) => {
                                const user = users.find(u => u.id === userId);
                                return user ? (
                                  <span
                                    key={userId}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                  >
                                    {user.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        عنوان المهمة
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        وصف المهمة
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        المدة المتوقعة (بالأيام)
                      </label>
                      <input
                        type="number"
                        value={newTask.estimatedDuration || ''}
                        onChange={(e) => setNewTask({ 
                          ...newTask, 
                          estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        الأقسام المطلوبة
                      </label>
                      <div className="mt-2 space-y-2">
                        {departments.map((dept) => (
                          <label key={dept} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newTask.requiredDepartments.includes(dept)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewTask({
                                    ...newTask,
                                    requiredDepartments: [...newTask.requiredDepartments, dept],
                                  });
                                } else {
                                  setNewTask({
                                    ...newTask,
                                    requiredDepartments: newTask.requiredDepartments.filter(
                                      (d) => d !== dept
                                    ),
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="mr-2 text-sm text-gray-700">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        تعيين الموظفين
                      </label>
                      <div className="mt-2 space-y-2">
                        {employees.map((employee) => (
                          <label key={employee.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newTask.assignedTo.includes(employee.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewTask({
                                    ...newTask,
                                    assignedTo: [...newTask.assignedTo, employee.id],
                                  });
                                } else {
                                  setNewTask({
                                    ...newTask,
                                    assignedTo: newTask.assignedTo.filter(
                                      (id) => id !== employee.id
                                    ),
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="mr-2 text-sm text-gray-700">
                              {employee.name} - {employee.department}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {tasks.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          يعتمد على
                        </label>
                        <div className="mt-2 space-y-2">
                          {tasks.map((task, index) => (
                            <label key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={newTask.dependsOn.includes(index.toString())}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewTask({
                                      ...newTask,
                                      dependsOn: [...newTask.dependsOn, index.toString()],
                                    });
                                  } else {
                                    setNewTask({
                                      ...newTask,
                                      dependsOn: newTask.dependsOn.filter(
                                        (id) => id !== index.toString()
                                      ),
                                    });
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="mr-2 text-sm text-gray-700">{task.title}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddTask}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      إضافة المهمة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              حفظ القالب
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setTitle('');
                setDescription('');
                setTasks([]);
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-all duration-300 group-hover:scale-110">
                  <Copy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => createProjectFromTemplate(template.id)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="إنشاء مشروع من القالب"
                >
                  <FolderPlus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف القالب"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">{template.tasks.length} مهمة</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {new Set(template.tasks.flatMap(t => t.assignedTo)).size} موظف
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(template.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {template.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 group/task hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {task.requiredDepartments.includes('التصميم المعماري') ? (
                          <Building2 className="w-4 h-4 text-purple-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 group-hover/task:text-blue-600 transition-colors">
                            {task.title}
                          </h4>
                          {task.estimatedDuration && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{task.estimatedDuration} يوم</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      </div>
                    </div>

                    {task.assignedTo.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.assignedTo.map((userId) => {
                          const user = users.find(u => u.id === userId);
                          return user ? (
                            <span
                              key={userId}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <Users className="w-3 h-3" />
                              {user.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {task.dependsOn.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          يعتمد على: {task.dependsOn.map(depIndex => {
                            const depTask = template.tasks[parseInt(depIndex)];
                            return depTask?.title;
                          }).filter(Boolean).join('، ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};