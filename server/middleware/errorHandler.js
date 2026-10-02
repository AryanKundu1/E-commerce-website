const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => { 
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Something went wrong';

  if (err.name === 'CastError') { status = 400; message = 'Invalid ID format'; }
  if (err.name === 'ValidationError') { status = 400; }

  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
