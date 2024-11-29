import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Task, User } from '../types';

interface Props {
  employee: User;
  tasks: Task[];
}

export const EmployeePerformanceChart: React.FC<Props> = ({ employee, tasks }) => {
  // Get last 6 months of data
  const getMonthlyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleString('ar-SA', { month: 'short' });
      
      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate.getMonth() === date.getMonth() &&
               taskDate.getFullYear() === date.getFullYear() &&
               task.assignedTo.includes(employee.id);
      });
      
      data.push({
        month: monthName,
        completed: monthTasks.filter(t => t.status === 'completed').length,
        inProgress: monthTasks.filter(t => t.status === 'in-progress').length,
        pending: monthTasks.filter(t => t.status === 'pending').length,
      });
    }
    
    return data;
  };

  const data = getMonthlyData();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        أداء {employee.name} خلال الـ 6 أشهر الماضية
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" name="مكتملة" fill="#22c55e" stackId="a" />
            <Bar dataKey="inProgress" name="قيد التنفيذ" fill="#3b82f6" stackId="a" />
            <Bar dataKey="pending" name="معلقة" fill="#94a3b8" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};