const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

exports.init = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  // Middleware to authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.token;
      if (!token) return next(new Error('Authentication error: No token provided'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) return next(new Error('Authentication error: User not found'));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Authenticated client connected: ${socket.user.name} (${socket.id})`);

    // Automatically join a room named after the userId
    socket.join(socket.user._id.toString());

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

exports.emitTaskUpdate = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};
