import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  discount: {
    everyNOrders: parseInt(process.env.DISCOUNT_EVERY_N_ORDERS || '3', 10),
    percent: parseInt(process.env.DISCOUNT_PERCENT || '10', 10),
  },
} as const;
