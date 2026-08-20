const express = require('express');
const router = express.Router();
const { explainError, answerFollowUpChat } = require('../services/aiService');

/**
 * POST /api/explain
 * Body: { errorText: string, context?: object }
 * Headers: x-gemini-api-key (optional custom user key)
 */
router.post('/explain', async (req, res) => {
  try {
    const { errorText, context } = req.body;

    if (!errorText || typeof errorText !== 'string' || errorText.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a valid error message or stack trace to diagnose.'
      });
    }

    const customApiKey = req.headers['x-gemini-api-key'] || req.headers['x-api-key'];
    const result = await explainError(errorText, customApiKey, context || {});

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error in /api/explain:', err);
    return res.status(500).json({
      error: 'An internal error occurred while analyzing the error trace.',
      details: err.message
    });
  }
});

/**
 * POST /api/chat
 * Body: { message: string, history: Array, errorContext: object }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history, errorContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a valid message to chat with the assistant.'
      });
    }

    const customApiKey = req.headers['x-gemini-api-key'] || req.headers['x-api-key'];
    const result = await answerFollowUpChat(history || [], message, errorContext || {}, customApiKey);

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: 'An internal error occurred during follow-up chat.',
      details: err.message
    });
  }
});

module.exports = router;
