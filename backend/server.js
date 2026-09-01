import app from './src/app.js';
import redis from './src/config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Sirf local development me app.listen chalega
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 QuickClip Backend running at:`);
    console.log(`   - Local:   http://localhost:${PORT}`);
    console.log(`   - Network: http://127.0.0.1:${PORT}`);
  });

  const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(async () => {
      try {
        await redis.quit();
        console.log('⚡ Redis connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during Redis shutdown:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

// Vercel Serverless Function ke liye export zaroori hai
export default app;