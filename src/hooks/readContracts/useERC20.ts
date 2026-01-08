
import { useReadContractERC20 } from './useReadContractERC20';

/**
 */
export function useERC20() {
    const { readContractERC20 } = useReadContractERC20();

    const allowance = async (
        tokenAddress: `0x${string}`,
        owner: string,
        spender: string,
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'erc20',
                tokenAddress, 
                'allowance', 
                [owner, spender],
                force
            );
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('allowance error:', error);
            return BigInt(0);
        }
    };

    const balanceOf = async (
        tokenAddress: `0x${string}`,
        account: string,
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'erc20',
                tokenAddress, 
                'balanceOf', 
                [account],
                force
            );
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('balanceOf error:', error);
            return BigInt(0);
        }
    };

    const decimals = async (tokenAddress: `0x${string}`): Promise<number> => {
        try {
            const tx = await readContractERC20('erc20', tokenAddress, 'decimals', []);
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('decimals error:', error);
            return 0;
        }
    };

    const name = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('erc20', tokenAddress, 'name', []);
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('name error:', error);
            return '';
        }
    };

    const symbol = async (tokenAddress: `0x${string}`): Promise<string> => {
        try {
            const tx = await readContractERC20('erc20', tokenAddress, 'symbol', []);
            return tx ? String(tx) : '';
        } catch (error) {
            console.error('symbol error:', error);
            return '';
        }
    };

    const totalSupply = async (
        tokenAddress: `0x${string}`, 
        force: boolean = false
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'erc20', 
                tokenAddress, 
                'totalSupply', 
                [], 
                force
            );
            if (typeof tx === 'bigint') {
                return tx;
            }
            if (typeof tx === 'number') {
                return BigInt(tx);
            }
            if (typeof tx === 'string') {
                return BigInt(tx);
            }
            return BigInt(0);
        } catch (error) {
            console.error('totalSupply error:', error);
            return BigInt(0);
        }
    };

    const mintDate = async (
        tokenAddress: `0x${string}`,
        address: string,
        force: boolean = false
    ): Promise<number> => {
        try {
            const tx = await readContractERC20(
                'erc20', 
                tokenAddress, 
                'mintDate', 
                [address], 
                force
            );
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('mintDate error:', error);
            return 0;
        }
    };

    return {
        allowance,
        balanceOf,
        decimals,
        name,
        symbol,
        totalSupply,
        mintDate
    };
}

