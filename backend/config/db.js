const mysql = require('mysql2/promise');

let pool;

function getDbConfig() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  };
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDbConfig());
  }

  return pool;
}

async function initializeDatabase() {
  try {
    const db = getPool();
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log('MySQL connection established successfully.');
  } catch (error) {
    console.error('Failed to initialize MySQL connection:', error.message);
    process.exit(1);
  }
}

module.exports = {
  getPool,
  initializeDatabase,
};
