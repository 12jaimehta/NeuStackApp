import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`\nServer running at http://localhost:${config.port}`);
  console.log(`Environment  : ${config.nodeEnv}`);
  console.log(` Discount rule: every ${config.discount.everyNOrders} orders → ${config.discount.percent}% off`);
});

// Graceful shutdown 
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully…');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default server;
