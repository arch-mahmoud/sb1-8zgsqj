export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ar-SA');
};

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString('ar-SA');
};

export const getDaysDifference = (date1: Date | string, date2: Date | string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dueDate: Date | string | undefined, status: string) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

export const calculateTimeRemaining = (date: Date) => {
  if (!date) {
    return { expired: true, years: 0, months: 0, days: 0, totalDays: 0 };
  }
  
  const now = new Date();
  const targetDate = new Date(date);
  
  if (isNaN(targetDate.getTime())) {
    return { expired: true, years: 0, months: 0, days: 0, totalDays: 0 };
  }
  
  const diffTime = targetDate.getTime() - now.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (totalDays < 0) {
    return { expired: true, years: 0, months: 0, days: 0, totalDays };
  }

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = Math.floor((totalDays % 365) % 30);

  return { expired: false, years, months, days, totalDays };
};

export const calculateAge = (birthDate: Date) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  if (isNaN(birth.getTime())) return 0;
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};