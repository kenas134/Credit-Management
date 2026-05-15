// mobile/src/utils/formatCurrency.js
// Currency formatting utilities for Ghana Cedis (GHS)

/**
 * Format a number as Ghana Cedis
 * @param {number|string} amount
 * @param {boolean} showSymbol - whether to show GH₵ prefix
 * @returns {string}
 */
export const formatGHS = (amount, showSymbol = true) => {
  const num = parseFloat(amount) || 0;
  const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return showSymbol ? `GH₵${formatted}` : formatted;
};

/**
 * Format amount with color context
 * @param {number} amount
 * @returns {{ text: string, isPositive: boolean }}
 */
export const formatBalance = (amount) => {
  const num = parseFloat(amount) || 0;
  return {
    text: formatGHS(Math.abs(num)),
    isPositive: num <= 0,
    isZero: num === 0,
  };
};

/**
 * Parse a currency string back to number
 * @param {string} value - e.g. "GH₵1,234.56"
 * @returns {number}
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
};
