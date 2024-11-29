import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';
import { Task, User } from '../types';

interface Props {
  employees: User[];
  tasks: Task[];
  period: 'day' | 'week' | 'month';
}

export const CombinedPerformanceChart: React.FC<Props> = ({ employees, tasks, period }) => {
  const getData = () => {
    const data: any[] = [];
    const today = new Date();

    const getDateRange = () => {
      switch (period) {
        case 'day':
          return Array.from({ length: 24 }, (_, i) => {
            const date = new Date(today);
            date.setHours(i, 0, 0, 0);
            return date;
          });
        case 'week':
          return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            return date;
          });
        case 'month':
          return Array.from({ length: 6 }, (_, i) => {
            const date = new Date(today);
            date.setMonth(date.getMonth() - (5 - i));
            return date;
          });
      }
    };

    const dateRange = getDateRange();

    dateRange.forEach((date) => {
      const timePoint = {
        label: period === 'day' 
          ? date.getHours().toString().padStart(2, '0') + ':00'
          : period === 'week'
          ? date.toLocaleDateString('ar-SA', { weekday: 'short' })
          : date.toLocaleDateString('ar-SA', { month: 'short' }),
        total: 0,
      };

      employees.forEach(employee => {
        const completedTasks = tasks.filter(task => {
          const taskDate = new Date(task.updatedAt);
          const isCompleted = task.status === 'completed';
          const isAssigned = task.assignedTo.includes(employee.id);
          
          if (!isCompleted || !isAssigned) return false;

          switch (period) {
            case 'day':
              return taskDate.getDate() === date.getDate() &&
                     taskDate.getMonth() === date.getMonth() &&
                     taskDate.getHours() === date.getHours();
            case 'week':
              return taskDate.getDate() === date.getDate() &&
                     taskDate.getMonth() === date.getMonth();
            case 'month':
              return taskDate.getMonth() === date.getMonth() &&
                     taskDate.getFullYear() === date.getFullYear();
          }
        });

        const inProgressTasks = tasks.filter(task => {
          const taskDate = new Date(task.updatedAt);
          return task.status === 'in-progress' &&
                 task.assignedTo.includes(employee.id) &&
                 taskDate.getTime() <= date.getTime();
        });

        timePoint[`${employee.name}_completed`] = completedTasks.length;
        timePoint[`${employee.name}_inProgress`] = inProgressTasks.length;
        timePoint.total += completedTasks.length;
      });

      data.push(timePoint);
    });

    return data;
  };

  const data = getData();
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="label"
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ 
                value: 'عدد المهام المنجزة',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#6b7280' }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="total"
              fill="#f3f4f6"
              stroke="#9ca3af"
              name="الإجمالي"
              yAxisId="right"
            />
            {employees.map((employee, index) => (
              <React.Fragment key={employee.id}>
                <Bar
                  dataKey={`${employee.name}_completed`}
                  name={`${employee.name} - منجز`}
                  fill={colors[index % colors.length]}
                  yAxisId="left"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey={`${employee.name}_inProgress`}
                  name={`${employee.name} - قيد التنفيذ`}
                  stroke={colors[index % colors.length]}
                  strokeDasharray="5 5"
                  dot={{ fill: colors[index % colors.length], r: 4 }}
                  yAxisId="left"
                />
              </React.Fragment>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};