// mobile/tests/hooks.test.js
// Unit tests for mobile utility functions

import { formatGHS, parseCurrency } from '../src/utils/formatCurrency';
import { formatDate, timeAgo, isOverdue, daysUntilDue } from '../src/utils/formatDate';

// ── formatCurrency ────────────────────────────────────────────────────────────
describe('formatGHS', () => {
  test('formats a whole number', () => {
    expect(formatGHS(500)).toBe('GH₵500.00');
  });

  test('formats decimal amount', () => {
    expect(formatGHS(1234.5)).toBe('GH₵1,234.50');
  });

  test('formats zero', () => {
    expect(formatGHS(0)).toBe('GH₵0.00');
  });

  test('formats without symbol', () => {
    expect(formatGHS(250, false)).toBe('250.00');
  });

  test('handles string input', () => {
    expect(formatGHS('1000')).toBe('GH₵1,000.00');
  });

  test('handles undefined/null as 0', () => {
    expect(formatGHS(null)).toBe('GH₵0.00');
    expect(formatGHS(undefined)).toBe('GH₵0.00');
  });
});

describe('parseCurrency', () => {
  test('parses GH₵ string back to number', () => {
    expect(parseCurrency('GH₵1,234.56')).toBe(1234.56);
  });

  test('handles plain number string', () => {
    expect(parseCurrency('500.00')).toBe(500);
  });

  test('handles empty string', () => {
    expect(parseCurrency('')).toBe(0);
  });
});

// ── formatDate ────────────────────────────────────────────────────────────────
describe('isOverdue', () => {
  test('returns true for past dates', () => {
    expect(isOverdue('2020-01-01')).toBe(true);
  });

  test('returns false for future dates', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isOverdue(future.toISOString())).toBe(false);
  });

  test('returns false for null', () => {
    expect(isOverdue(null)).toBe(false);
  });
});

describe('daysUntilDue', () => {
  test('returns positive number for future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const result = daysUntilDue(future.toISOString());
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(10);
  });

  test('returns negative number for overdue date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const result = daysUntilDue(past.toISOString());
    expect(result).toBeLessThan(0);
  });

  test('returns null for null input', () => {
    expect(daysUntilDue(null)).toBeNull();
  });
});

describe('timeAgo', () => {
  test('returns "just now" for very recent', () => {
    expect(timeAgo(new Date().toISOString())).toBe('just now');
  });

  test('returns minutes ago', () => {
    const t = new Date(Date.now() - 1000 * 60 * 5);
    expect(timeAgo(t.toISOString())).toBe('5m ago');
  });

  test('returns hours ago', () => {
    const t = new Date(Date.now() - 1000 * 60 * 60 * 3);
    expect(timeAgo(t.toISOString())).toBe('3h ago');
  });

  test('returns days ago', () => {
    const t = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);
    expect(timeAgo(t.toISOString())).toBe('3d ago');
  });
});
