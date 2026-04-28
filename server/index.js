require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const socketService = require('./src/services/socketService');
const AppError = require('./src/utils/AppError');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const logger = require('./src/utils/logger');
const { authLimiter } = require('./src/middleware/rateLimiter');

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Initialize Socket.io
socketService.init(server);

// Middlewares
app.use(helmet()); 
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ 
  origin: allowedOrigin,
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser

// Routes
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Handling undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Log unexpected errors
    if (!err.isOperational) {
      logger.error('ERROR 💥', err);
    }

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || 'Something went wrong!',
    });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
