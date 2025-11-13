// middleware/adminAuth.js
import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Admin token required' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid auth header format' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET || 'ADMIN_SECRET_DEFAULT');
    // optionally check payload.role or username
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Not an admin token' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired admin token' });
  }
};

export default adminAuth;
