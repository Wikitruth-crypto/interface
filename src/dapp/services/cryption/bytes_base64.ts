// 将 Base64 转换为以太坊智能合约可用的 bytes 格式
export const Base64ToEthereumBytes = (base64: string): string => {
    // 解码 Base64
    const binaryString = window.atob(base64);
    // 转换为十六进制
    const hexString = Array.from(binaryString, (char) => 
        ('0' + char.charCodeAt(0).toString(16)).slice(-2)
    ).join('');
    // 添加 "0x" 前缀
    return "0x" + hexString;
};

// 将以太坊 bytes 转换为 Base64
export const EthereumBytesToBase64 = (ethereumBytes: string): string => {
    // 移除 "0x" 前缀
    const hexString = ethereumBytes.startsWith('0x') ? ethereumBytes.slice(2) : ethereumBytes;
    // 转换为二进制字符串
    const binaryString = hexString.match(/.{1,2}/g)?.map(byte => 
        String.fromCharCode(parseInt(byte, 16))
    ).join('') || '';
    // 编码为 Base64
    return window.btoa(binaryString);
};