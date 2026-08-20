const express = require('express');
const cors = require('cors');
require('dotenv').config();

const explainRouter = require('./routes/explain');
const healthRouter = require('./routes/health');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key', 'x-api-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', explainRouter);
app.use('/api', healthRouter);

// Root test route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to ErrorLens AI Backend API',
    endpoints: {
      health: 'GET /api/health',
      explain: 'POST /api/explain',
      chat: 'POST /api/chat'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

module.exports = app;
