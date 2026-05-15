// src/middlewares/role.middleware.js
// Role-based authorization middleware

const { sendError } = require('../utils/apiResponse');

/**
 * Restricts access to specific roles
 * @param {...string} roles - Allowed roles (e.g., 'OWNER', 'ADMIN')
 * @returns Express middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
    }

    next();
  };
};

module.exports = { authorize };
