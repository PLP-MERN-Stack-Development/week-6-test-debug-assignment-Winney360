const jwt = require('jsonwebtoken');

module.exports.generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};