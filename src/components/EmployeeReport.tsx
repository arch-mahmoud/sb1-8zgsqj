import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { User, Task } from '../types';

// Register Arabic font
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v20/SLXVc1nY6HkvangtZmpcWmhzfH5lWWgcQyyS4J0.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Cairo'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1B2A4E',
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1B2A4E',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 10,
    textAlign: 'right',
  },
  value: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statBox: {
    width: '25%',
    padding: 10,
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 5,
    textAlign: 'right',
  },
  statValue: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'right',
  },
  taskList: {
    marginTop: 10,
  },
  task: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  taskTitle: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 5,
    textAlign: 'right',
  },
  taskDescription: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 10,
  },
});

interface Props {
  employee: User;
  tasks: Task[];
  logo: string;
}

export const EmployeeReport: React.FC<Props> = ({ employee, tasks, logo }) => {
  const stats = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    paused: tasks.filter(t => t.status === 'paused').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  const completionRate = tasks.length > 0
    ? Math.round((stats.completed / tasks.length) * 100)
    : 0;

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const avgCompletionTime = completedTasks.length > 0
    ? Math.round(completedTasks.reduce((acc, task) => {
        const start = new Date(task.createdAt).getTime();
        const end = new Date(task.updatedAt).getTime();
        return acc + (end - start) / (1000 * 60 * 60 * 24);
      }, 0) / completedTasks.length)
    : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
        </View>

        {/* Title */}
        <Text style={styles.title}>تقرير أداء الموظف</Text>

        {/* Employee Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الموظف</Text>
          <View style={styles.row}>
            <Text style={styles.value}>{employee.name}</Text>
            <Text style={styles.label}>الاسم:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>{employee.email}</Text>
            <Text style={styles.label}>البريد الإلكتروني:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>{employee.department}</Text>
            <Text style={styles.label}>القسم:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>{employee.position}</Text>
            <Text style={styles.label}>المنصب:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>
              {new Date(employee.joinDate).toLocaleDateString('ar-SA')}
            </Text>
            <Text style={styles.label}>تاريخ الانضمام:</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإحصائيات</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>نسبة الإنجاز</Text>
              <Text style={styles.statValue}>{completionRate}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>المهام المكتملة</Text>
              <Text style={styles.statValue}>{stats.completed}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>قيد التنفيذ</Text>
              <Text style={styles.statValue}>{stats.inProgress}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>متوقفة</Text>
              <Text style={styles.statValue}>{stats.paused}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>متأخرة</Text>
              <Text style={styles.statValue}>{stats.overdue}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>متوسط وقت الإنجاز</Text>
              <Text style={styles.statValue}>{avgCompletionTime} يوم</Text>
            </View>
          </View>
        </View>

        {/* Current Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المهام الحالية</Text>
          <View style={styles.taskList}>
            {tasks.filter(task => task.status !== 'completed').map((task, index) => (
              <View key={index} style={styles.task}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <Text style={styles.taskDescription}>
                  الحالة: {
                    task.status === 'in-progress' ? 'قيد التنفيذ' :
                    task.status === 'paused' ? 'متوقفة' : 'معلقة'
                  }
                </Text>
                {task.dueDate && (
                  <Text style={styles.taskDescription}>
                    تاريخ التسليم: {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          تم إنشاء هذا التقرير في {new Date().toLocaleDateString('ar-SA')}
        </Text>
      </Page>
    </Document>
  );
};