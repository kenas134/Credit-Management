// src/server.js
// Entry point — starts the HTTP server and background jobs

require('dotenv').config();
const app = require('./app');
const { logger } = require('./utils/logger');
const { startReminderJob } = require('./jobs/reminder.job');
const { startOverdueJob } = require('./jobs/overdue.job');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);

  // Start background cron jobs
  startReminderJob();
  startOverdueJob();
  logger.info('⏰ Background jobs started');
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = server;
