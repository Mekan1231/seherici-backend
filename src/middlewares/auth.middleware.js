const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const parts = (req.headers.authorization || '').trim().split(/\s+/);

  if (parts.length < 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'AUTH_REQUIRED' });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({ message: 'AUTH_REQUIRED' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'INVALID_TOKEN' });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'AUTH_REQUIRED' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'FORBIDDEN' });
  }

  return next();
};

module.exports = {
  requireAuth,
  requireRole,
};
