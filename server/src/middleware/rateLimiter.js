const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs for auth routes
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: (req, res, next) => {
    next(new AppError('Too many requests, please try again later.', 429));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };
