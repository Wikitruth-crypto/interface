/**
 * Sapphire provider 类型扩展
 */
declare global {
    interface Window {
        ethereum?: {
            _sapphireWrapped?: boolean;
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            [key: string]: any;
        };
    }
}

export { };

