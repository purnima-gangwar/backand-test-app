// General error handler and 404 handler helpers
const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
