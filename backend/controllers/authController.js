const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  };
}

async function register(req, res, next) {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'username, email, password, and phone are required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = getPool();
    await db.execute(
      `INSERT INTO KodUser (username, email, password, phone, role, balance)
       VALUES (?, ?, ?, ?, 'customer', 100000.00)`,
      [username, email, hashedPassword, phone]
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username and password are required',
      });
    }

    const db = getPool();
    const [rows] = await db.execute(
      `SELECT uid, username, password, role
       FROM KodUser
       WHERE username = ?
       LIMIT 1`,
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const token = jwt.sign(
      { role: user.role },
      process.env.JWT_SECRET,
      {
        subject: user.username,
        algorithm: 'HS256',
        expiresIn: '1h',
      }
    );

    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    await db.execute(
      `INSERT INTO UserToken (token, uid, expiry)
       VALUES (?, ?, ?)`,
      [token, user.uid, expiry]
    );

    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies ? req.cookies.token : undefined;

    if (token) {
      const db = getPool();
      await db.execute(
        `DELETE FROM UserToken
         WHERE token = ?`,
        [token]
      );
    }

    res.clearCookie('token', getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
};
