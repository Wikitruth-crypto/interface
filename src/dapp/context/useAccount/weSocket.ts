// // 抑制 WalletConnect WebSocket 连接失败的日志（如果使用 Injected Wallet，这是正常的）
// if (typeof window !== 'undefined') {
//     const originalError = console.error
//     console.error = (...args: any[]) => {
//         // 过滤掉 WalletConnect WebSocket 连接失败的错误
//         if (args[0]?.includes?.('WebSocket connection') && args[0]?.includes?.('relay.walletconnect.org')) {
//             return // 不输出这个错误
//         }
//         originalError.apply(console, args)
//     }
// }