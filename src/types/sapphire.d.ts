/**
 * Sapphire provider type extension
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

