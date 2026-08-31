import rateLimit from 'express-rate-limit';

// Share limiter: Maximum 20 clipboard creations per 15 minutes per IP
export const shareLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many share requests created from this IP. Please try again after 15 minutes.',
  },
});

// Retrieve limiter: Maximum 10 retrieval attempts per minute per IP (Prevents Brute-Force)
export const retrieveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many retrieval attempts. Please wait 1 minute before trying again.',
  },
});