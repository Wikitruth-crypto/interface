react-dom-client.development.js:28004 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
sync.ts:80 [IPFS Gateway] Polling started, interval: 15 minutes
current.ts:40 chainId: 23295
deprecations.ts:9  ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
warnOnce @ deprecations.ts:9
deprecations.ts:9  ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
warnOnce @ deprecations.ts:9
current.ts:40 chainId: 23295
sync.ts:49 [IPFS Gateway] Updated to: https://ipfs.io/ipfs/{cid}
useLisenerRoles.tsx:44 userId-boxDetailPage: 
useLisenerRoles.tsx:81 roles-boxDetailPage: Array(1)
useLisenerRoles.tsx:44 userId-boxDetailPage: 
useLisenerRoles.tsx:81 roles-boxDetailPage: Array(1)
react-dom-client.development.js:7597  Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
    at Object.throwInvalidHookError (react-dom-client.development.js:7597:13)
    at exports.useContext (react.development.js:1212:25)
    at useBoxDetailContext (BoxDetailContext.tsx:180:19)
    at useButtonActive (useButtonActive.ts:25:46)
    at calcMoney.tsx:33:22
    at Object.react_stack_bottom_frame (react-dom-client.development.js:25989:20)
    at runWithFiberInDEV (react-dom-client.development.js:871:30)
    at commitHookEffectListMount (react-dom-client.development.js:13249:29)
    at commitHookPassiveMountEffects (react-dom-client.development.js:13336:11)
    at commitPassiveMountOnFiber (react-dom-client.development.js:15484:13)
react-dom-client.development.js:9362  An error occurred in the <CalcMoney> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

defaultOnUncaughtError @ react-dom-client.development.js:9362
react-dom-client.development.js:7597  Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
    at Object.throwInvalidHookError (react-dom-client.development.js:7597:13)
    at exports.useContext (react.development.js:1212:25)
    at useBoxDetailContext (BoxDetailContext.tsx:180:19)
    at useButtonActive (useButtonActive.ts:25:46)
    at calcMoney.tsx:33:22
    at Object.react_stack_bottom_frame (react-dom-client.development.js:25989:20)
    at runWithFiberInDEV (react-dom-client.development.js:871:30)
    at commitHookEffectListMount (react-dom-client.development.js:13249:29)
    at commitHookPassiveMountEffects (react-dom-client.development.js:13336:11)
    at reconnectPassiveEffects (react-dom-client.development.js:15832:11)
react-dom-client.development.js:9362  An error occurred in the <CalcMoney> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

defaultOnUncaughtError @ react-dom-client.development.js:9362
errors.ts:698  Uncaught (in promise) Error: could not coalesce error (error={ "code": -32002, "data": { "method": "PUBLIC_requestAccounts" }, "message": "Request of type 'PUBLIC_requestAccounts' already pending for origin http://localhost:3000. Please wait." }, payload={ "id": 2, "jsonrpc": "2.0", "method": "eth_accounts", "params": [  ] }, code=UNKNOWN_ERROR, version=6.15.0)
    at makeError (errors.ts:698:21)
    at _BrowserProvider.getRpcError (provider-jsonrpc.ts:1086:16)
    at _BrowserProvider.getRpcError (provider-browser.ts:193:22)
    at provider-jsonrpc.ts:571:45
