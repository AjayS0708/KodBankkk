require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const { initializeDatabase } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const originValidator = (origin, callback) => {
  // Allow server-to-server and non-browser requests without Origin header.
  if (!origin) {
    return callback(null, true);
  }

  const isConfiguredAllowed = allowedOrigins.includes(origin);
  const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
  const isLocalhost =
    origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');

  if (isConfiguredAllowed || isVercelPreview || isLocalhost) {
    return callback(null, true);
  }

  return callback(new Error('Not allowed by CORS'));
};

app.use(
  cors({
    origin: originValidator,
    credentials: true,
  })
);
app.options('*', cors({ origin: originValidator, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route registration only; API handlers will be added later.
app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

(async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Kodbank backend running on port ${PORT}`);
  });
})();
