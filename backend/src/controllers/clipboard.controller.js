import redis from '../config/redis.js';
import { generateNumericCode } from '../utils/codeGenerator.js';
import { getPresignedUploadUrl } from '../config/s3.js';

const TTL = parseInt(process.env.CLIPBOARD_TTL_SECONDS || '600', 10);

/**
 * 1. Share Text or File Metadata
 * Generates an atomic 6-digit code and stores payload in Redis with auto-expiry.
 */
export const shareData = async (req, res, next) => {
  try {
    const { text, fileUrl, fileName, fileType, burnAfterRead = false } = req.body;

    if (!text && !fileUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either text or a file to share.',
      });
    }

    let code;
    let isSet = false;
    let attempts = 0;

    // Retry loop: Generates a code and tries atomic SET with NX (Set if Not Exists)
    while (!isSet && attempts < 5) {
      code = generateNumericCode(6);
      
      const payload = JSON.stringify({
        text: text || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileType: fileType || null,
        burnAfterRead: Boolean(burnAfterRead),
        createdAt: new Date().toISOString(),
      });

      // 'NX' = Ensures no duplicate overwrites
      // 'EX' = Auto-deletes key after TTL seconds (prevents memory leaks)
      const result = await redis.set(`clip:${code}`, payload, 'EX', TTL, 'NX');
      if (result === 'OK') {
        isSet = true;
      }
      attempts++;
    }

    if (!isSet) {
      return res.status(500).json({
        success: false,
        error: 'System is currently busy generating unique codes. Please try again.',
      });
    }

    return res.status(201).json({
      success: true,
      code,
      expiresInSeconds: TTL,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Retrieve Data by 6-Digit Code
 */
export const retrieveData = async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!code || code.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid code format. 6 digits required.',
      });
    }

    const data = await redis.get(`clip:${code}`);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Code not found, expired, or already burned.',
      });
    }

    const parsedData = JSON.parse(data);

    // If Burn After Read was enabled by sender, delete immediately after first read
    if (parsedData.burnAfterRead) {
      await redis.del(`clip:${code}`);
    }

    return res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Request Direct Cloud Upload URL (for large files/images)
 */
export const requestUploadUrl = async (req, res, next) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        error: 'fileName and fileType are required.',
      });
    }

    const uploadDetails = await getPresignedUploadUrl(fileName, fileType);

    if (!uploadDetails) {
      return res.status(501).json({
        success: false,
        error: 'Cloud storage is not configured on server.',
      });
    }

    return res.status(200).json({
      success: true,
      ...uploadDetails,
    });
  } catch (error) {
    next(error);
  }
};