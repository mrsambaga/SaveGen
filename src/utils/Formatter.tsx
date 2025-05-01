export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatCurrencyLabel = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000)} M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }
  return amount.toString();
};

export const capitalize = (text: string) => {
  if (!text) return '';

  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const shortenText = (text: string, maxLength: number = 10) => {
  if (!text) return '';

  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

