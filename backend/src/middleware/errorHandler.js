export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${_req.originalUrl}`
  });
};

export const errorHandler = (error, _req, res, _next) => {
  const message = error?.message || 'Internal server error';
  const lowerMessage = message.toLowerCase();
  const statusCode =
    lowerMessage.includes('required') ||
    lowerMessage.includes('invalid') ||
    lowerMessage.includes('not configured')
      ? 400
      : 500;

  const payload = {
    success: false,
    message
  };

  // Include stack in non-production for easier debugging
  if (process.env.NODE_ENV !== 'production' && error?.stack) {
    payload.stack = error.stack;
  }

  console.error('[error]', message);

  res.status(statusCode).json(payload);
};
