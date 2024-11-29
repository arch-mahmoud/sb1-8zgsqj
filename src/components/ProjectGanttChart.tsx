import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Task, User } from '../types';
import { clsx } from 'clsx';

interface Props {
  projectId: string;
  tasks: Task[];
  users: User[];
}

export const ProjectGanttChart: React.FC<Props> = ({ projectId, tasks, users }) => {
  const data = useMemo(() => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const startDate = new Date(Math.min(...projectTasks.map(t => new Date(t.createdAt).getTime())));
    
    return projectTasks.map(task => {
      const assignedUsers = task.assignedTo
        .map(userId => users.find(u => u.id === userId)?.name)
        .filter(Boolean)
        .join('، ');

      const start = new Date(task.createdAt).getTime();
      const end = task.dueDate 
        ? new Date(task.dueDate).getTime()
        : start + (7 * 24 * 60 * 60 * 1000); // Default to 7 days if no due date
      
      const duration = Math.ceil((end - start) / (24 * 60 * 60 * 1000)); // Duration in days
      const offset = Math.ceil((start - startDate.getTime()) / (24 * 60 * 60 * 1000)); // Offset in days

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        assignedTo: assignedUsers,
        status: task.status,
        start,
        end,
        duration,
        offset,
      };
    });
  }, [projectId, tasks, users]);

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        لا توجد مهام في هذا المشروع
      </div>
    );
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in-progress':
        return '#3b82f6';
      case 'paused':
        return '#f59e0b';
      default:
        return '#94a3b8';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const task = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <div className="font-medium text-gray-900">{task.title}</div>
        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="text-sm">
            <span className="text-gray-600">المسؤول: </span>
            <span className="text-gray-900">{task.assignedTo}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">المدة: </span>
            <span className="text-gray-900">{task.duration} يوم</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">الحالة: </span>
            <span className={clsx(
              task.status === 'completed' && 'text-green-600',
              task.status === 'in-progress' && 'text-blue-600',
              task.status === 'paused' && 'text-amber-600',
              task.status === 'pending' && 'text-gray-600'
            )}>
              {task.status === 'completed' ? 'مكتملة' :
               task.status === 'in-progress' ? 'قيد التنفيذ' :
               task.status === 'paused' ? 'متوقفة' : 'معلقة'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, Math.max(...data.map(d => d.offset + d.duration))]}
            tickFormatter={(value) => `${value} يوم`}
          />
          <YAxis
            type="category"
            dataKey="title"
            width={180}
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="duration" stackId="a">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getStatusColor(entry.status)}
                x={entry.offset}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};