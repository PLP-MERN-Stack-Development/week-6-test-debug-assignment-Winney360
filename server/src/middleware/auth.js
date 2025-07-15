const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded._id) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Debugging log
    res.status(401).json({ error: 'Invalid token' });
  }
};