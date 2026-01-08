// Convert Base64 to Ethereum bytes format that can be used by the smart contract
export const Base64ToEthereumBytes = (base64: string): string => {
    // Decode Base64
    const binaryString = window.atob(base64);
    // Convert to hexadecimal
    const hexString = Array.from(binaryString, (char) => 
        ('0' + char.charCodeAt(0).toString(16)).slice(-2)
    ).join('');
    // Add "0x" prefix
    return "0x" + hexString;
};

// Convert Ethereum bytes to Base64
export const EthereumBytesToBase64 = (ethereumBytes: string): string => {
    // Remove "0x" prefix
    const hexString = ethereumBytes.startsWith('0x') ? ethereumBytes.slice(2) : ethereumBytes;
    // Convert to binary string
    const binaryString = hexString.match(/.{1,2}/g)?.map(byte => 
        String.fromCharCode(parseInt(byte, 16))
    ).join('') || '';
    // Encode to Base64
    return window.btoa(binaryString);
};