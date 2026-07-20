import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { seedOnStartup } from './config/seedOnStartup.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import deliveryRoutes from './routes/delivery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars first
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database and seed if empty
connectDB().then(() => seedOnStartup());

const app = express();
const httpServer = createServer(app);

// Calculate allowed origins first so both Express and Socket.io can use it
const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || '';

const allowedOrigins = clientUrl === '*'
  ? null  // null = allow all via callback
  : [
      ...clientUrl.split(',').map(u => u.trim()).filter(Boolean),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? (allowedOrigins === null ? true : allowedOrigins)
      : true, // Allow all origins in dev mode (e.g. local IPs)
    credentials: true,
  }
});

// Expose io to routes/controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // haha testing if this logs on vercel
  // console.log("socket connection attempt from", socket.handshake.headers.origin);

  // Clients can join a room based on their order ID to receive updates for that specific order
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined room order_${orderId}`);
  });

  // Delivery partner emits location updates
  socket.on('updateDeliveryLocation', ({ orderId, lat, lng }) => {
    io.to(`order_${orderId}`).emit('deliveryLocationUpdate', { lat, lng });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Security — relax crossOriginResourcePolicy for cross-origin API calls
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — reads CLIENT_URL from env (comma-separated for multiple origins)
// Set CLIENT_URL=* to allow all origins temporarily during testing

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));

// Logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body + Cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);

app.get('/api/seed', async (req, res) => {
  try {
    await seedOnStartup();
    res.json({ message: 'Database seeding checked and executed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global error handler (must be last api middleware)
app.use(errorHandler);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {

  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Any routes not matching API will serve the frontend index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'Feedme-Now API is running 🍔' });
  });
}

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 TastyBite server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
} else {
  // In production, we also need to start the httpServer
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 TastyBite server running on port ${PORT} [production]`);
    // console.log("finally deployed, fingers crossed it doesn't crash 🤞");
  });
}

export default app;
