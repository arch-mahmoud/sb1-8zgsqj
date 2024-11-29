import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Project, Task } from '../types';

interface Props {
  project: Project;
}

export const TaskForm: React.FC<Props> = ({ project }) => {
  const { users, tasks, addTask } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dependsOn, setDependsOn] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  const projectTasks = tasks.filter(task => task.projectId === project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      projectId: project.id,
      title,
      description,
      assignedTo,
      dependsOn,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    setTitle('');
    setDescription('');
    setAssignedTo([]);
    setDependsOn([]);
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          عنوان المهمة
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          وصف المهمة
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          تاريخ التسليم
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          تعيين إلى
        </label>
        <div className="mt-2 space-y-2">
          {users
            .filter((user) => user.role === 'employee')
            .map((user) => (
              <label key={user.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={assignedTo.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAssignedTo([...assignedTo, user.id]);
                    } else {
                      setAssignedTo(assignedTo.filter(id => id !== user.id));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="mr-2">{user.name}</span>
              </label>
            ))}
        </div>
      </div>

      {projectTasks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            يعتمد على إكمال
          </label>
          <div className="mt-2 space-y-2">
            {projectTasks.map((task) => (
              <label key={task.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={dependsOn.includes(task.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDependsOn([...dependsOn, task.id]);
                    } else {
                      setDependsOn(dependsOn.filter(id => id !== task.id));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="mr-2">{task.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        إضافة مهمة
      </button>
    </form>
  );
};