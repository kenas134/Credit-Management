// src/middlewares/auth.middleware.js
// JWT authentication middleware

const { verifyToken } = require('../utils/generateToken');
const { sendError } = require('../utils/apiResponse');
const prisma = require('../config/db');

/**
 * Verifies the JWT access token from Authorization header
 * Attaches decoded user to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    // Verify user still exists and is active
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, isActive: true },
      select: { id: true, name: true, role: true, phone: true },
    });

    if (!user) {
      return sendError(res, 'User no longer exists or is inactive', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

module.exports = { authenticate };
