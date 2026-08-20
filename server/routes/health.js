const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ErrorLens AI Backend',
    version: '1.0.0',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Local'
  });
});

module.exports = router;
