import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined in environment variables.');
}

const redis = new Redis(redisUrl, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  keepAlive: 10000, // Sends periodic TCP keepalive pings (prevents idle ETIMEDOUT)
  connectTimeout: 10000, // 10s connection timeout
  tls: {
    rejectUnauthorized: false,
  },
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('⚡ [Upstash Redis] Cloud Connected successfully');
});

redis.on('error', (err) => {
  // Suppress transient network timeout noise from flooding logs
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
    console.warn('⚠️ [Redis] Network glitch/idle reset detected. Auto-reconnecting...');
    return;
  }
  console.error('❌ [Redis] Connection Error:', err.message);
});

export default redis;