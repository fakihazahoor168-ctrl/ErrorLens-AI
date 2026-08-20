export const PRESET_ERRORS = [
  {
    id: 'econnrefused',
    label: 'ECONNREFUSED 127.0.0.1:5000',
    tag: 'Network / Backend',
    errorText: `Error: connect ECONNREFUSED 127.0.0.1:5000
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1605:16)
    at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 5000
}`
  },
  {
    id: 'cors',
    label: 'CORS Policy Blocked',
    tag: 'Web / Browser',
    errorText: `Access to fetch at 'http://localhost:5000/api/explain' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.`
  },
  {
    id: 'typeerror-undefined',
    label: 'TypeError: Cannot read properties of undefined',
    tag: 'JavaScript / React',
    errorText: `TypeError: Cannot read properties of undefined (reading 'data')
    at UserProfile (src/components/UserProfile.jsx:24:18)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:20103:13)`
  },
  {
    id: 'eaddrinuse',
    label: 'EADDRINUSE Port 3000',
    tag: 'Node.js',
    errorText: `Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1904:16)
    at listenInCluster (node:net:1961:12)
    at Server.listen (node:net:2063:7)`
  },
  {
    id: 'react-hydration',
    label: 'React Hydration Mismatch',
    tag: 'React / SSR',
    errorText: `Error: Hydration failed because the initial UI does not match what was rendered on the server.
Warning: Expected server HTML to contain a matching <div> in <p>.
  See https://reactjs.org/link/hydration-mismatch for more info.`
  },
  {
    id: 'heap-limit',
    label: 'JavaScript Heap Out of Memory',
    tag: 'Node.js / Memory',
    errorText: `<--- Last few GCs --->
[34120:0x128008000]    45210 ms: Mark-sweep 2045.1 (2055.2) -> 2044.8 (2055.2) MB, 1420.5 / 0.0 ms  (average mu = 0.082, current mu = 0.001) allocation failure; scavenge might not succeed

<--- JS stacktrace --->
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`
  }
];
