import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import clipboardRoutes from './routes/clipboard.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. HTTP Security Headers (Helmet)
// crossOriginResourcePolicy ko cross-origin rakha hai taaki frontend static files aur icons smoothly load ho sakein
app.use(
  helmet({
    contentSecurityPolicy: false, // CDN scripts (jaise Lucide icons/Tailwind) load hone ke liye
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Strict Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  'https://instant-clipboard-mu.vercel.app',
  'http://localhost:5001',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5001'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or same-origin static UI)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// 3. API Rate Limiting (Spam & 6-digit brute-force guessing se bachata hai)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 120, // Har IP se max 120 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sirf API endpoints par rate limit apply karein (static files par nahi)
app.use('/api', apiLimiter);

// 4. Payload size limit (Redis memory safety)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve Frontend Static UI
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', clipboardRoutes);

// Fallback to serve index.html for any unmatched non-API routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }
  next();
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;