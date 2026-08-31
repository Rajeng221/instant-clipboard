import { Router } from 'express';
import {
  shareData,
  retrieveData,
  requestUploadUrl,
} from '../controllers/clipboard.controller.js';
import {
  shareLimiter,
  retrieveLimiter,
} from '../middlewares/rateLimiter.js';

const router = Router();

// Validate that code is strictly a 6-digit numeric string before processing
const validateCodeParam = (req, res, next) => {
  const { code } = req.params;
  if (!code || !/^\d{6}$/.test(code)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid retrieval code format. Code must be a 6-digit number.',
    });
  }
  next();
};

// POST /api/share - Generate 6-digit code and store payload in Redis
router.post('/share', shareLimiter, shareData);

// GET /api/retrieve/:code - Fetch payload using 6-digit code (Rate limited + Pattern validated)
router.get('/retrieve/:code', retrieveLimiter, validateCodeParam, retrieveData);

// POST /api/upload-url - Generate direct S3/R2 presigned upload URL
router.post('/upload-url', shareLimiter, requestUploadUrl);

export default router;