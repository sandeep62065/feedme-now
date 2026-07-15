import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Token helpers ────────────────────────────────────────────────────────────

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, phone });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({ accessToken, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Internal server error during signup' });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error during login' });
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully.' });
};

/**
 * POST /api/auth/refresh
 * Issues a new access token using the httpOnly refresh token cookie.
 */
export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'No refresh token.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ message: 'Refresh token revoked.' });
  }

  const newAccessToken = signAccessToken(user._id);
  res.json({ accessToken: newAccessToken });
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

/**
 * GET /api/auth/addresses
 */
export const getAddresses = async (req, res) => {
  res.json({ addresses: req.user.addresses });
};

/**
 * POST /api/auth/addresses
 */
export const addAddress = async (req, res) => {
  const { label, formattedAddress, lat, lng, placeId, isDefault } = req.body;
  if (!formattedAddress) {
    return res.status(400).json({ message: 'formattedAddress is required.' });
  }

  const user = await User.findById(req.user._id);

  // If this is marked default, unset others
  if (isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }

  user.addresses.push({ label, formattedAddress, lat, lng, placeId, isDefault: !!isDefault });
  await user.save();
  res.status(201).json({ addresses: user.addresses });
};

/**
 * DELETE /api/auth/addresses/:addressId
 */
export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.addressId
  );
  await user.save();
  res.json({ addresses: user.addresses });
};
