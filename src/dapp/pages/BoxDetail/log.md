## 首次打开

react-dom-client.development.js:8129  The result of getSnapshot should be cached to avoid an infinite loop

react-dom-client.development.js:4624  Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

react-dom-client.development.js:9362  An error occurred in the <BidButton> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

useExchange.ts:23  calcPayMoney error: TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at hashKey (utils.ts:228:15)
    at hashQueryKeyByOptions (utils.ts:220:10)
    at _a12.defaultQueryOptions (queryClient.ts:597:36)
    at _a12.getQueryData (queryClient.ts:134:26)
    at useReadContract.ts:60:36
    at calcPayMoney (useExchange.ts:16:30)
    at fetchCalcMoney (calcMoney.tsx:32:37)
    at calcMoney.tsx:37:13


## 再次刷新
useButtonDisabled.ts:28  The result of getSnapshot should be cached to avoid an infinite loop

react-dom-client.development.js:4624  Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.

An error occurred in the <BidButton> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

useExchange.ts:23  calcPayMoney error: TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at hashKey (utils.ts:228:15)
    at hashQueryKeyByOptions (utils.ts:220:10)
    at _a12.defaultQueryOptions (queryClient.ts:597:36)
    at _a12.getQueryData (queryClient.ts:134:26)
    at useReadContract.ts:60:36
    at calcPayMoney (useExchange.ts:16:30)
    at fetchCalcMoney (calcMoney.tsx:32:37)
    at calcMoney.tsx:37:13

