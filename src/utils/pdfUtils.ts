import { jsPDF } from 'jspdf';
import { PromissoryNote, Client } from '../types';
import { formatCurrency } from './invoiceUtils';

const tafqeet = (number: number) => {
  // This is a simplified version - you may want to use a proper Arabic number to words library
  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  return `${units[Math.floor(number)]} ريال سعودي فقط لا غير`;
};

export const generatePromissoryNotePDF = async (note: PromissoryNote, client: Client) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  doc.setFont('Helvetica');
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);

  // Add title
  doc.text('سند لأمر', doc.internal.pageSize.width / 2, 50, { align: 'center' });

  // Add content
  doc.setFontSize(12);
  let y = 100;
  const margin = 40;
  const lineHeight = 20;

  // Header
  doc.text('تعهد غير مشروط بالدفع:', margin, y);
  y += lineHeight * 2;

  // Main content
  const mainText = `أتعهد أنا الموقع أدناه بأن أدفع بموجب هذا السند لأمر ${client.name} مبلغ وقدره ${formatCurrency(note.amount)} (${tafqeet(note.amount)}) في تاريخ ${new Date(note.dueDate).toLocaleDateString('ar-SA')}`;
  
  const lines = doc.splitTextToSize(mainText, doc.internal.pageSize.width - (margin * 2));
  lines.forEach(line => {
    doc.text(line, margin, y);
    y += lineHeight;
  });

  y += lineHeight * 2;

  // Client Information
  doc.text('معلومات المحرر:', margin, y);
  y += lineHeight;
  doc.text(`الاسم: ${client.name}`, margin, y);
  y += lineHeight;
  
  if (client.type === 'facility') {
    doc.text(`السجل التجاري: ${client.facilityInfo?.commercialRegister}`, margin, y);
    y += lineHeight;
    if (client.facilityInfo?.vatNumber) {
      doc.text(`الرقم الضريبي: ${client.facilityInfo.vatNumber}`, margin, y);
      y += lineHeight;
    }
  } else if (client.directInfo?.idNumber) {
    doc.text(`رقم الهوية: ${client.directInfo.idNumber}`, margin, y);
    y += lineHeight;
  }

  doc.text(`العنوان: ${client.address}`, margin, y);
  y += lineHeight;
  doc.text(`رقم الجوال: ${client.phone}`, margin, y);
  y += lineHeight * 2;

  // Note Information
  doc.text('معلومات السند:', margin, y);
  y += lineHeight;
  doc.text(`رقم السند: ${note.number}`, margin, y);
  y += lineHeight;
  doc.text(`تاريخ التحرير: ${new Date(note.date).toLocaleDateString('ar-SA')}`, margin, y);
  y += lineHeight;
  doc.text(`تاريخ الاستحقاق: ${new Date(note.dueDate).toLocaleDateString('ar-SA')}`, margin, y);
  y += lineHeight;
  doc.text('مكان الوفاء: مدينة الرياض', margin, y);
  y += lineHeight * 2;

  if (note.notes) {
    doc.text('ملاحظات:', margin, y);
    y += lineHeight;
    doc.text(note.notes, margin, y);
    y += lineHeight * 2;
  }

  // Signatures
  y = doc.internal.pageSize.height - 150;
  doc.text('توقيع المحرر:', margin, y);
  doc.text('توقيع المستفيد:', doc.internal.pageSize.width - margin - 100, y);
  
  y += lineHeight;
  doc.text('الاسم: ________________', margin, y);
  doc.text('الاسم: ________________', doc.internal.pageSize.width - margin - 150, y);
  
  y += lineHeight;
  doc.text('التوقيع: ________________', margin, y);
  doc.text('التوقيع: ________________', doc.internal.pageSize.width - margin - 150, y);
  
  y += lineHeight;
  doc.text('التاريخ: ________________', margin, y);
  doc.text('التاريخ: ________________', doc.internal.pageSize.width - margin - 150, y);

  // Footer
  doc.setFontSize(10);
  doc.text(
    'هذا السند غير قابل للتجزئة ويخضع لأنظمة المملكة العربية السعودية',
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 30,
    { align: 'center' }
  );

  return doc;
};

export const downloadPromissoryNote = async (note: PromissoryNote, client: Client) => {
  try {
    const doc = await generatePromissoryNotePDF(note, client);
    doc.save(`سند_لأمر_${note.number}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('حدث خطأ أثناء إنشاء ملف PDF');
  }
};