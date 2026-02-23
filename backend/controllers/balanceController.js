const { getPool } = require('../config/db');

async function checkBalance(req, res, next) {
  try {
    const username = req.user ? req.user.sub : undefined;

    if (!username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication payload',
      });
    }

    const db = getPool();
    const [rows] = await db.execute(
      `SELECT balance
       FROM KodUser
       WHERE username = ?
       LIMIT 1`,
      [username]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      balance: rows[0].balance,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  checkBalance,
};
