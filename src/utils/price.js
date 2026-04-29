export const parsePrice = (s) => parseFloat(String(s).replace(/[$,]/g, ''));
export const formatPrice = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
