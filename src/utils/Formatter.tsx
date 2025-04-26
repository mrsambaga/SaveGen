export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const capitalize = (text: string) => {
  if (!text) return '';

  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

