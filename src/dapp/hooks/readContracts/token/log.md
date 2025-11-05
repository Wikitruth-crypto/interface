❌ EIP712 签名失败: TypeError: connection.connector.getChainId is not a function
    at getConnectorClient (getConnectorClient.ts:113:55)
    at signTypedData2 (signTypedData.ts:53:23)
    at Object.mutationFn (signTypedData.ts:18:14)
    at Object.fn (mutation.ts:190:29)
    at run (retryer.ts:155:49)
    at Object.start (retryer.ts:221:9)
    at _a7.execute (mutation.ts:233:40)
    at async useEIP712_ERC20secret.tsx:185:31
    at async useCheckEIP712Permit.ts:194:35
    at async readAllowance (useReadAllowance.ts:71:37)

❌ EIP712 签名失败: TypeError: connection.connector.getChainId is not a function
    at getConnectorClient (getConnectorClient.ts:113:55)
    at signTypedData2 (signTypedData.ts:53:23)
    at Object.mutationFn (signTypedData.ts:18:14)
    at Object.fn (mutation.ts:190:29)
    at run (retryer.ts:155:49)
    at Object.start (retryer.ts:221:9)
    at _a7.execute (mutation.ts:233:40)
    at async useEIP712_ERC20secret.tsx:185:31
    at async useCheckEIP712Permit.ts:194:35
    at async readAllowance (useReadAllowance.ts:71:37)

[EIP712] Failed to generate permit: Error: 生成签名失败
    at useCheckEIP712Permit.ts:205:27
    at async readAllowance (useReadAllowance.ts:71:37)
    at async fetchData (hooksTest.tsx:36:28)

[useIsPermitExpired] Error: Error: 生成签名失败
    at useCheckEIP712Permit.ts:205:27
    at async readAllowance (useReadAllowance.ts:71:37)
    at async fetchData (hooksTest.tsx:36:28)

[EIP712] Failed to generate permit: Error: 生成签名失败
    at useCheckEIP712Permit.ts:205:27
    at async readAllowance (useReadAllowance.ts:71:37)
    at async fetchData (hooksTest.tsx:36:28)

[useIsPermitExpired] Error: Error: 生成签名失败
    at useCheckEIP712Permit.ts:205:27
    at async readAllowance (useReadAllowance.ts:71:37)
    at async fetchData (hooksTest.tsx:36:28)

[checkAllowance] Error: Error: 生成签名失败
    at useCheckEIP712Permit.ts:205:27
    at async readAllowance (useReadAllowance.ts:71:37)
    at async fetchData (hooksTest.tsx:36:28)

[checkAllowance] Error: Error: 生成签名失败
    at useCheckEIP712Permit.ts:205:27
    at async readAllowance (useReadAllowance.ts:71:37)
    at async fetchData (hooksTest.tsx:36:28)