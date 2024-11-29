import QRCode from 'qrcode';

const encoder = new TextEncoder();

interface QRCodeData {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  invoiceTotal: number;
  vatAmount: number;
}

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  // Format according to ZATCA requirements
  const tlvData = new Uint8Array([
    1, data.sellerName.length, ...encoder.encode(data.sellerName),
    2, data.vatNumber.length, ...encoder.encode(data.vatNumber),
    3, data.timestamp.length, ...encoder.encode(data.timestamp),
    4, data.invoiceTotal.toString().length, ...encoder.encode(data.invoiceTotal.toString()),
    5, data.vatAmount.toString().length, ...encoder.encode(data.vatAmount.toString())
  ]);

  const concatenatedData = btoa(String.fromCharCode(...tlvData));
  return await QRCode.toDataURL(concatenatedData);
};

export const calculateVAT = (amount: number, rate: number = 15): number => {
  return (amount * rate) / 100;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount);
};