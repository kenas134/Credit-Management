// mobile/src/utils/formatDate.js
// Date formatting utilities

/**
 * Format a date as a readable string
 * @param {string|Date} date
 * @returns {string} e.g. "15 May 2025"
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a date with time
 * @param {string|Date} date
 * @returns {string} e.g. "15 May 2025, 10:30 AM"
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time string
 * @param {string|Date} date
 * @returns {string} e.g. "2 days ago", "just now"
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

/**
 * Check if a date is past (overdue)
 * @param {string|Date} date
 * @returns {boolean}
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Get days until a due date (negative = overdue)
 * @param {string|Date} dueDate
 * @returns {number}
 */
export const daysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const diff = new Date(dueDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
