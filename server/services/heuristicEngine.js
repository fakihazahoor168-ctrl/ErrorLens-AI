/**
 * Built-in Intelligent Heuristic Diagnostic Engine
 * Provides instant, zero-latency expert explanations with actionable solutions.
 */

function analyzeWithHeuristics(errorText = '', metadata = {}) {
  const text = errorText.trim();
  const lower = text.toLowerCase();

  // 1. ECONNREFUSED (Explicitly specified in Plan.docx!)
  if (/econnrefused/i.test(text)) {
    const portMatch = text.match(/(?:127\.0\.0\.1|localhost|0\.0\.0\.0):(\d+)/i) || text.match(/port\s*(\d+)/i);
    const port = portMatch ? portMatch[1] : 'the target';

    return {
      title: `Connection Refused (ECONNREFUSED)`,
      whatHappened: `Your application tried to connect to a network service or backend server on port ${port}, but nothing was listening or accepting connections at that address.`,
      whyItOccurred: `1. The target server (e.g. your backend API, database, or microservice) is not currently running.\n2. The server crashed or stopped during startup due to an uncaught exception.\n3. The client and server are configured to use different ports (e.g. client is requesting port ${port}, but the server is listening on another port like 3000 or 8080).\n4. A local firewall or proxy is actively blocking outbound/inbound loopback requests.`,
      solutions: [
        {
          step: 1,
          title: `Start the backend or target server`,
          description: `Ensure your target server is actively running in another terminal window.`,
          code: `# In your backend directory\nnpm run dev\n# or\nnode server.js`,
          language: `bash`
        },
        {
          step: 2,
          title: `Verify host and port configuration`,
          description: `Check your environment variables or config file to ensure client and server ports match.`,
          code: `// Express server example\nconst PORT = process.env.PORT || ${port === 'the target' ? '5000' : port};\napp.listen(PORT, '0.0.0.0', () => {\n  console.log(\`Server running on http://localhost:\${PORT}\`);\n});`,
          language: `javascript`
        },
        {
          step: 3,
          title: `Check if the port is open and listening`,
          description: `Run a command in your terminal to see if anything is currently bound to port ${port}.`,
          code: `# Windows PowerShell\nGet-NetTCPConnection -LocalPort ${port === 'the target' ? '5000' : port}\n\n# macOS / Linux\nlsof -i :${port === 'the target' ? '5000' : port}`,
          language: `bash`
        }
      ],
      prevention: `Always configure dynamic environment variables (such as process.env.PORT) and implement retry logic or graceful error handling when establishing initial database or API connections.`,
      severity: 'high',
      detectedLanguage: metadata.language || 'Node.js / Network',
      errorCode: 'ECONNREFUSED'
    };
  }

  // 2. CORS Error
  if (/cors|cross-origin|access-control-allow-origin/i.test(text)) {
    return {
      title: `CORS Policy Blocked (Cross-Origin Resource Sharing)`,
      whatHappened: `The browser blocked a network request from your frontend because the backend server did not include the required 'Access-Control-Allow-Origin' header in its response.`,
      whyItOccurred: `Web browsers enforce the Same-Origin Policy for security. When your frontend (e.g., http://localhost:5173 or your Vercel frontend URL) requests data from an API on a different origin (e.g., http://localhost:5000), the server must explicitly declare that this origin is allowed to access its resources.`,
      solutions: [
        {
          step: 1,
          title: `Install and configure the 'cors' middleware in Express`,
          description: `Enable CORS on your Express backend using the official 'cors' package.`,
          code: `// 1. Install\n// npm install cors\n\n// 2. In your Express server (server.js / app.js)\nconst express = require('express');\nconst cors = require('cors');\nconst app = express();\n\n// Allow all origins (or specify allowed origins)\napp.use(cors({\n  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],\n  credentials: true\n}));`,
          language: `javascript`
        },
        {
          step: 2,
          title: `For Vercel unified fullstack deployment`,
          description: `When deploying both frontend and backend on Vercel under the same domain, use relative paths like '/api/explain' so CORS restrictions do not apply.`,
          code: `// Frontend API call\nconst response = await fetch('/api/explain', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ errorText })\n});`,
          language: `javascript`
        }
      ],
      prevention: `In production, use relative API routing on the same domain or configure an explicit whitelist of allowed domain origins in your CORS middleware.`,
      severity: 'medium',
      detectedLanguage: 'Web / Express',
      errorCode: 'CORS'
    };
  }

  // 3. EADDRINUSE (Port already in use)
  if (/eaddrinuse/i.test(text)) {
    const portMatch = text.match(/port\s*(\d+)/i) || text.match(/:(\d+)/);
    const port = portMatch ? portMatch[1] : '3000';

    return {
      title: `Port Already In Use (EADDRINUSE)`,
      whatHappened: `Your server attempted to bind to port ${port}, but another process or previously running instance is already occupying that port.`,
      whyItOccurred: `A previous server process did not terminate cleanly (or is running in the background), or a different application is currently using port ${port}.`,
      solutions: [
        {
          step: 1,
          title: `Find and terminate the process occupying the port`,
          description: `Kill the process currently holding port ${port}.`,
          code: `# Windows PowerShell\nStop-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess -Force\n\n# macOS / Linux\nnpx kill-port ${port}\n# or\nkill -9 $(lsof -t -i:${port})`,
          language: `bash`
        },
        {
          step: 2,
          title: `Change the port dynamically in your app`,
          description: `Allow fallback to another available port.`,
          code: `const PORT = process.env.PORT || ${Number(port) + 1};\napp.listen(PORT, () => console.log(\`Running on port \${PORT}\`));`,
          language: `javascript`
        }
      ],
      prevention: `Use process managers like PM2 or nodemon with clean SIGINT/SIGTERM handlers to ensure server processes cleanly release sockets on exit.`,
      severity: 'medium',
      detectedLanguage: 'Node.js',
      errorCode: 'EADDRINUSE'
    };
  }

  // 4. TypeError: Cannot read property / properties of undefined or null
  if (/cannot read propert|is not a function|undefined is not an object/i.test(text)) {
    return {
      title: `Null / Undefined Property Access (TypeError)`,
      whatHappened: `Your code attempted to access a property, method, or key on a variable that evaluated to 'undefined' or 'null' at runtime.`,
      whyItOccurred: `1. An asynchronous API request has not resolved yet, so the state is initially undefined.\n2. Expected object structure or nested response key does not exist.\n3. A function parameter or component prop was not provided.`,
      solutions: [
        {
          step: 1,
          title: `Use Optional Chaining (?.) and Nullish Coalescing (??)`,
          description: `Safely navigate nested properties without throwing runtime exceptions.`,
          code: `// Instead of:\n// const name = user.profile.name;\n\n// Use safe optional chaining:\nconst name = user?.profile?.name ?? 'Anonymous';`,
          language: `javascript`
        },
        {
          step: 2,
          title: `Provide safe initial state in React`,
          description: `Always provide a fallback initial state or add loading guards before rendering data.`,
          code: `const [data, setData] = useState([]); // Default array instead of undefined\n\nif (isLoading) {\n  return <Spinner />;\n}\n\nreturn <div>{data?.map(item => <p key={item.id}>{item.title}</p>)}</div>;`,
          language: `jsx`
        }
      ],
      prevention: `Adopt TypeScript for compile-time null-safety checks, or use schema validation libraries like Zod/Joi to validate incoming payload structures.`,
      severity: 'medium',
      detectedLanguage: metadata.language || 'JavaScript / React',
      errorCode: 'TypeError'
    };
  }

  // 5. MODULE_NOT_FOUND / Cannot find module
  if (/module_not_found|cannot find module|no module named/i.test(text)) {
    const modMatch = text.match(/cannot find module\s*['"]([^'"]+)['"]/i) || text.match(/no module named\s*['"]?(\w+)['"]?/i);
    const mod = modMatch ? modMatch[1] : 'the specified package';

    return {
      title: `Module Not Found (${mod})`,
      whatHappened: `The runtime could not locate the imported module '${mod}' in node_modules or at the specified relative file path.`,
      whyItOccurred: `1. The package has not been installed yet in your project.\n2. There is a typo in the import path or missing file extension (e.g. './Component' vs './Component.jsx').\n3. The dependencies were installed in a different folder or directory level.`,
      solutions: [
        {
          step: 1,
          title: `Install the missing package`,
          description: `Install the module via npm / yarn.`,
          code: `npm install ${mod}`,
          language: `bash`
        },
        {
          step: 2,
          title: `Verify file path casing and extensions`,
          description: `Ensure the relative path exactly matches the case-sensitive filename on disk.`,
          code: `// If importing local file:\nimport MyComponent from './components/MyComponent.jsx';`,
          language: `javascript`
        }
      ],
      prevention: `Commit your package.json and lockfile (package-lock.json / pnpm-lock.yaml), and verify all dependencies are listed in 'dependencies' rather than unlisted global tools.`,
      severity: 'medium',
      detectedLanguage: metadata.language || 'Node.js',
      errorCode: 'MODULE_NOT_FOUND'
    };
  }

  // 6. React Hydration Mismatch
  if (/hydration failed|text content did not match server-rendered html|hydrating/i.test(text)) {
    return {
      title: `React Hydration Mismatch`,
      whatHappened: `The HTML generated on the server (SSR / SSG) did not match the initial virtual DOM tree rendered by React in the client browser.`,
      whyItOccurred: `1. Using browser-only APIs (window, localStorage, document, navigator) during initial render before mounting.\n2. Non-deterministic values like Date.now(), Math.random(), or time zones rendered during SSR.\n3. Invalid HTML nesting (e.g. <p> containing a <div> or <table> without <tbody>).`,
      solutions: [
        {
          step: 1,
          title: `Defer client-only rendering with useEffect or useState mounted flag`,
          description: `Render client-specific data only after the component has mounted.`,
          code: `import { useState, useEffect } from 'react';\n\nexport default function ClientOnlyComponent() {\n  const [isMounted, setIsMounted] = useState(false);\n\n  useEffect(() => {\n    setIsMounted(true);\n  }, []);\n\n  if (!isMounted) {\n    return null; // or skeleton placeholder\n  }\n\n  return <div>{window.location.href}</div>;\n}`,
          language: `jsx`
        },
        {
          step: 2,
          title: `Fix invalid HTML tag nesting`,
          description: `Ensure tags like <p> do not wrap block elements like <div>, <p>, or <section>.`,
          code: `<!-- Invalid -->\n<p><div>Content</div></p>\n\n<!-- Valid -->\n<div><div>Content</div></div>`,
          language: `html`
        }
      ],
      prevention: `Keep initial server and client render outputs strictly identical, and isolate dynamic browser state to useEffect or client components.`,
      severity: 'medium',
      detectedLanguage: 'React',
      errorCode: 'HYDRATION_ERROR'
    };
  }

  // 7. Heap Out of Memory (JavaScript Heap Limit)
  if (/heap out of memory|ineffective mark-compacts near heap limit/i.test(text)) {
    return {
      title: `JavaScript Heap Out of Memory`,
      whatHappened: `The Node.js process consumed all allocated RAM and crashed because the garbage collector could not free enough memory.`,
      whyItOccurred: `1. An infinite loop or unbounded array/object accumulation in memory.\n2. Processing large files or heavy datasets completely in memory instead of streaming.\n3. Heavy frontend build/bundling (Webpack/Vite/TypeScript) exceeding default Node.js memory limits (usually 2GB-4GB).`,
      solutions: [
        {
          step: 1,
          title: `Increase Node.js max old space size`,
          description: `Set the memory limit to 4GB or 8GB when executing commands.`,
          code: `# Run script with increased memory limit\nNODE_OPTIONS="--max-old-space-size=4096" npm run build`,
          language: `bash`
        },
        {
          step: 2,
          title: `Use Streams for reading/writing large files`,
          description: `Stream large files chunk-by-chunk instead of loading full buffers.`,
          code: `const fs = require('fs');\nconst readStream = fs.createReadStream('large-file.csv');\nreadStream.on('data', (chunk) => {\n  // Process chunk\n});`,
          language: `javascript`
        }
      ],
      prevention: `Avoid storing unbounded arrays in global scopes and leverage streams, pagination, or worker threads for data-heavy tasks.`,
      severity: 'critical',
      detectedLanguage: 'Node.js',
      errorCode: 'HEAP_OUT_OF_MEMORY'
    };
  }

  // 8. Headers Already Sent (ERR_HTTP_HEADERS_SENT)
  if (/err_http_headers_sent|cannot set headers after they are sent/i.test(text)) {
    return {
      title: `Headers Already Sent (ERR_HTTP_HEADERS_SENT)`,
      whatHappened: `Your Express handler attempted to send an HTTP response (res.json, res.send, res.redirect) multiple times for a single incoming request.`,
      whyItOccurred: `Missing 'return' statements before sending responses in conditionals, or sending responses inside asynchronous callbacks after an earlier response was already transmitted.`,
      solutions: [
        {
          step: 1,
          title: `Always return when sending a response in Express`,
          description: `Add 'return' statements so code execution immediately halts after responding.`,
          code: `app.post('/api/data', (req, res) => {\n  if (!req.body.name) {\n    return res.status(400).json({ error: 'Name is required' }); // Added return\n  }\n\n  // Subsequent logic only runs if previous check passed\n  return res.json({ success: true, name: req.body.name });\n});`,
          language: `javascript`
        }
      ],
      prevention: `Adopt the pattern: 'return res.status(...).json(...)' for all branching control flows in Express controllers.`,
      severity: 'medium',
      detectedLanguage: 'Node.js / Express',
      errorCode: 'ERR_HTTP_HEADERS_SENT'
    };
  }

  // 9. Generic Fallback Diagnostic
  const errorLines = text.split('\n').filter(l => l.trim().length > 0);
  const mainLine = errorLines[0] || 'Unknown runtime error';

  return {
    title: metadata.errorCode && metadata.errorCode !== 'UNKNOWN_ERROR' ? metadata.errorCode : 'Runtime / Build Error',
    whatHappened: `An error occurred during execution: "${mainLine.slice(0, 180)}${mainLine.length > 180 ? '...' : ''}". The system halted execution to prevent invalid state or data corruption.`,
    whyItOccurred: `1. An unexpected condition or input caused the program to throw an unhandled exception.\n2. A dependency, configuration, or environment variable may be missing or improperly configured.\n3. Review the stack trace to pinpoint the exact line in your source code where the exception originated.`,
    solutions: [
      {
        step: 1,
        title: `Check the exact stack trace location`,
        description: metadata.fileLocation 
          ? `The error triggered at ${metadata.fileLocation.file} (line ${metadata.fileLocation.line}). Inspect this file.` 
          : `Inspect the file and line number shown in the top frame of your terminal stack trace.`,
        code: metadata.fileLocation ? `// Inspect ${metadata.fileLocation.file}:${metadata.fileLocation.line}` : `// Check your console logs for the root file reference`,
        language: `javascript`
      },
      {
        step: 2,
        title: `Add defensive error handling (try / catch)`,
        description: `Wrap the failing logic with a try/catch block to log diagnostic context without crashing the application.`,
        code: `try {\n  // Problematic operation\n} catch (err) {\n  console.error('Operation failed:', err.message, err.stack);\n}`,
        language: `javascript`
      }
    ],
    prevention: `Add comprehensive input validation, enable strict linting rules, and implement structured error logging.`,
    severity: 'medium',
    detectedLanguage: metadata.language || 'General',
    errorCode: metadata.errorCode || 'ERROR'
  };
}

module.exports = {
  analyzeWithHeuristics
};
