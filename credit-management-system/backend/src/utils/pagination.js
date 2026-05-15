// src/utils/pagination.js
// Pagination helpers for list endpoints

/**
 * Parse pagination params from query string
 * @param {Object} query - req.query
 * @returns {{ page, limit, skip }}
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination metadata for response
 * @param {number} total - Total record count
 * @param {number} page
 * @param {number} limit
 * @returns {Object} Pagination metadata
 */
const buildPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

module.exports = { getPagination, buildPaginationMeta };
