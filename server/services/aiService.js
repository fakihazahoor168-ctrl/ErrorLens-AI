const { GoogleGenerativeAI } = require('@google/generative-ai');
const { analyzeWithHeuristics } = require('./heuristicEngine');
const { detectErrorMetadata } = require('./errorDetector');

/**
 * System prompt to guide AI in generating structured error analysis
 */
const SYSTEM_PROMPT = `You are ErrorLens AI, a world-class senior software engineer and debugging assistant.
Your job is to analyze software errors, stack traces, terminal logs, or crash messages provided by developers, and return a crystal-clear, structured diagnosis in valid JSON.

JSON Schema to follow strictly:
{
  "title": "Short error title (e.g. Connection Refused / ECONNREFUSED)",
  "whatHappened": "A concise, plain-English summary of what just went wrong (2-3 sentences).",
  "whyItOccurred": "Detailed root-cause analysis explaining the underlying reasons, misconfigurations, or triggers.",
  "solutions": [
    {
      "step": 1,
      "title": "Clear action title",
      "description": "Explanation of what to do",
      "code": "Ready-to-use code snippet, config, or terminal command",
      "language": "bash | javascript | python | etc"
    }
  ],
  "prevention": "Best practices, linting tips, or architecture patterns to avoid this in the future.",
  "severity": "low | medium | high | critical",
  "detectedLanguage": "Node.js | React | Python | Docker | TypeScript | Database | Web / Network | etc",
  "errorCode": "e.g. ECONNREFUSED | CORS | TypeError | 404 | etc"
}

Important:
- Return ONLY the JSON object. No Markdown code fences, no extra commentary before or after.
- Make solutions extremely practical and accurate. Always provide actionable code or terminal commands.
`;

/**
 * Explain an error using Gemini AI or fallback to Heuristic Engine
 */
async function explainError(errorText, customApiKey = null, userContext = {}) {
  const metadata = detectErrorMetadata(errorText);
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `${SYSTEM_PROMPT}

User's error message:
"""
${errorText}
"""

Additional context (if any):
Environment: ${userContext.environment || 'Not specified'}
Framework: ${userContext.framework || metadata.language}
Target: ${userContext.target || 'General'}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean response text if it contains markdown formatting
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleaned);
      return {
        ...parsed,
        source: 'ai-gemini',
        detectedLanguage: parsed.detectedLanguage || metadata.language,
        errorCode: parsed.errorCode || metadata.errorCode
      };
    } catch (aiErr) {
      console.warn('AI provider call failed or quota exceeded, falling back to built-in heuristic engine:', aiErr.message);
    }
  }

  // Fallback to built-in Heuristic Engine
  const heuristicResult = analyzeWithHeuristics(errorText, metadata);
  return {
    ...heuristicResult,
    source: 'built-in-engine'
  };
}

/**
 * Follow-up Q&A chat on the error
 */
async function answerFollowUpChat(history = [], message = '', errorContext = {}, customApiKey = null) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chatPrompt = `You are ErrorLens AI, helping a developer solve a specific error.
Current diagnosed error:
Title: ${errorContext.title || 'Error'}
What Happened: ${errorContext.whatHappened || ''}
Error Code: ${errorContext.errorCode || ''}
Raw Error: ${errorContext.rawError || ''}

Conversation history:
${history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}

User's new question:
"${message}"

Provide a concise, helpful, and direct answer with code/terminal snippets where appropriate. Format with clean GitHub Markdown.`;

      const result = await model.generateContent(chatPrompt);
      return {
        reply: result.response.text(),
        source: 'ai-gemini'
      };
    } catch (err) {
      console.warn('AI Chat failed, providing contextual fallback:', err.message);
    }
  }

  // Smart fallback chat responses
  const lowerMsg = message.toLowerCase();
  let reply = `Based on your error (${errorContext.errorCode || 'Runtime Issue'}): `;

  if (lowerMsg.includes('docker') || lowerMsg.includes('container')) {
    reply += `When running in Docker, ensure port forwarding is mapped in your \`docker-compose.yml\` (e.g. \`ports: - "5000:5000"\`) and that your server listens on \`0.0.0.0\` instead of \`127.0.0.1\` inside the container.`;
  } else if (lowerMsg.includes('mac') || lowerMsg.includes('airplay') || lowerMsg.includes('port 5000')) {
    reply += `On macOS Monterey and later, port 5000 is used by default by AirPlay Receiver! To free it up, either go to **System Settings > General > AirDrop & AirPlay** and turn off *AirPlay Receiver*, or change your server port to 5001 or 3001.`;
  } else if (lowerMsg.includes('vercel') || lowerMsg.includes('deploy')) {
    reply += `For Vercel deployment, remember that Vercel uses serverless functions in \`/api\`. Do not use persistent in-memory global state or infinite \`app.listen()\` loops in production—export the Express app or serverless handler directly!`;
  } else if (lowerMsg.includes('how to test') || lowerMsg.includes('verify')) {
    reply += `You can test if the fix worked by restarting your dev server (\`npm run dev\`), testing the endpoint with \`curl http://localhost:5000/api/health\` or Postman, and checking for HTTP 200 OK.`;
  } else {
    reply += `To troubleshoot further, double-check your environment variables (\`.env\`), restart your terminal/IDE to refresh cached bindings, and inspect console logs right before the error happened. Feel free to supply a Gemini API Key in the top right menu for deeper conversational AI answers!`;
  }

  return {
    reply,
    source: 'built-in-engine'
  };
}

module.exports = {
  explainError,
  answerFollowUpChat
};
