import crypto from 'crypto';

/**
 * Generates a cryptographically secure numeric code of specified length.
 * Defaults to a 6-digit integer (100000 to 999999).
 * 
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} - The generated numeric string code
 */
export function generateNumericCode(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  
  // crypto.randomInt ensures uniform distribution without predictability
  return crypto.randomInt(min, max + 1).toString();
}