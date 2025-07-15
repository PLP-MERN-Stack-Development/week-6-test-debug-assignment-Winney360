module.exports = (err, req, res, next) => {
  console.error('Error:', err.message); // Debugging log
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};