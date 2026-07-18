import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes — verifies the short-lived access token from
 * the Authorization: Bearer <token> header.
 */
export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated. No token provided.' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * Admin-only gate — must be used AFTER protect middleware.
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

/**
 * Delivery-partner only gate — must be used AFTER protect middleware.
 */
export const deliveryPartnerOnly = (req, res, next) => {
  if (req.user?.role !== 'delivery_partner') {
    return res.status(403).json({ message: 'Access denied. Delivery partners only.' });
  }
  next();
};
