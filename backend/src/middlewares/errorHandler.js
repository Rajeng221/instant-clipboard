/**
 * Global Error Handling Middleware
 * Catches all runtime errors and returns a standardized JSON response.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ [Server Error]:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack }),
  });
};