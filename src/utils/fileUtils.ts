export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileType = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('application/pdf')) return 'pdf';
  if (mimeType.includes('word')) return 'word';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
  return 'file';
};

export const validateFileSize = (file: File, maxSize: number) => {
  if (file.size > maxSize) {
    throw new Error(`حجم الملف يجب أن لا يتجاوز ${maxSize / (1024 * 1024)} ميجابايت`);
  }
  return true;
};