const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const token = req.cookies ? req.cookies.token : undefined;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}

module.exports = {
  protect,
};
