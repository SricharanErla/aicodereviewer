export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
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

  res.status(statusCode).json({
    success: false,
    message
  });
};
