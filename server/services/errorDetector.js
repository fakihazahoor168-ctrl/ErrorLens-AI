/**
 * Error Detection & Metadata Extraction Utility
 */

function detectErrorMetadata(errorText = '') {
  const text = errorText.trim();
  const lower = text.toLowerCase();

  let language = 'General';
  let category = 'Runtime Error';
  let errorCode = null;

  // Language / Framework detection
  if (/node:internal|at Module\._compile|at Object\.<anonymous>|npm ERR!|yarn error|pnpm/i.test(text) || lower.includes('node.js') || lower.includes('express')) {
    language = 'Node.js';
  } else if (/react|hydration failed|cannot read properties of null \(reading 'usestate'\)|invalid hook call|jsx|next\.js/i.test(text)) {
    language = 'React';
  } else if (/traceback \(most recent call last\)|file ".*", line \d+|nameerror|syntaxerror: invalid syntax|modulenotfounderror/i.test(text)) {
    language = 'Python';
  } else if (/docker|dockerfile|container|daemon|cannot connect to the docker daemon|docker compose/i.test(text)) {
    language = 'Docker';
  } else if (/mongoservererror|mongoose|postgresql|psycopg2|mysql|prisma|sequelize|knex/i.test(text)) {
    language = 'Database';
  } else if (/failed to load resource: net::|access to fetch at .* from origin .* has been blocked by cors policy|404 \(not found\)|500 \(internal server error\)|502 bad gateway/i.test(text)) {
    language = 'Web / Network';
  } else if (/error ts\d+|type '.*' is not assignable to type/i.test(text)) {
    language = 'TypeScript';
  } else if (/fatal: refusing to merge unrelated histories|git conflict|error: failed to push some refs/i.test(text)) {
    language = 'Git';
  }

  // Error code extraction
  const codeMatch = text.match(/\b(ECONNREFUSED|EADDRINUSE|ETIMEDOUT|ENOTFOUND|ENOENT|EACCES|EPERM|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND|CORS|ERR_HTTP_HEADERS_SENT|ERR_INVALID_ARG_TYPE)\b/i);
  if (codeMatch) {
    errorCode = codeMatch[1].toUpperCase();
  } else {
    const jsErrorMatch = text.match(/\b(TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|AssertionError)\b/);
    if (jsErrorMatch) {
      errorCode = jsErrorMatch[1];
    } else {
      const httpMatch = text.match(/\b(400|401|403|404|405|409|422|429|500|502|503|504)\b/);
      if (httpMatch) {
        errorCode = `HTTP ${httpMatch[1]}`;
      }
    }
  }

  // Extract file and line number if available
  let fileLocation = null;
  const lineMatch = text.match(/(?:at\s+|File\s+["']?)([\w\-./\\]+\.(?:js|jsx|ts|tsx|py|html|css|json|vue))(?::(\d+)(?::(\d+))?|["']?,\s+line\s+(\d+))/i);
  if (lineMatch) {
    const file = lineMatch[1];
    const line = lineMatch[2] || lineMatch[4];
    const col = lineMatch[3];
    fileLocation = { file, line, col };
  }

  return {
    language,
    category,
    errorCode: errorCode || 'UNKNOWN_ERROR',
    fileLocation
  };
}

module.exports = {
  detectErrorMetadata
};
