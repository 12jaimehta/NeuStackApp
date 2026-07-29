import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './shared/middleware/requestLogger';
import { errorHandler } from './shared/middleware/errorHandler';
import cartRoutes from './features/cart/cart.routes';
import checkoutRoutes from './features/checkout/checkout.routes';
import productRoutes from './features/products/product.routes';

const app = express();

// Security 
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

// Body Parsing 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging 
app.use(requestLogger);

// Health Check (unauthenticated) 
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Feature Routes 
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// 404 Catch-All 
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler 
app.use(errorHandler);

export default app;
