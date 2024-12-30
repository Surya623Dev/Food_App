// Utility function for currency formatting
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};