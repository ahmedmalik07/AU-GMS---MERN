// Middleware for JWT authentication
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Skip auth in development if no token is provided
  if (process.env.NODE_ENV === 'development' && !req.header('Authorization')) {
    console.log('Development mode: Skipping authentication');
    req.user = { id: 'development-user' };
    return next();
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({ 
      success: false,
      error: 'No token, authorization denied' 
    });
  }

  try {
    console.log('Verifying token...');
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    console.log('Token verified for user:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ 
      success: false,
      error: 'Token is not valid',
      details: err.message
    });
  }
};
