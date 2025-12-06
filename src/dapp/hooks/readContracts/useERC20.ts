
import { useReadContractERC20 } from './useReadContractERC20';

/**
 * ERC20 代币合约读取 Hook
 * 
 * 注意：所有函数都需要传入 token 地址，因为会有多个 ERC20 合约
 */
export function useERC20() {
    const { readContractERC20 } = useReadContractERC20();

    // 代币授权相关
    const allowance = async (
        tokenAddress: `0x${string}`,
        owner: string,
        spender: string
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'erc20',
                tokenAddress, 
                'allowance', 
                [owner, spender]
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
        account: string
    ): Promise<bigint> => {
        try {
            const tx = await readContractERC20(
                'erc20',
                tokenAddress, 
                'balanceOf', 
                [account]
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

    // 代币基本信息
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

    const totalSupply = async (tokenAddress: `0x${string}`): Promise<bigint> => {
        try {
            const tx = await readContractERC20('erc20', tokenAddress, 'totalSupply', []);
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

    // 铸造相关，这个函数只有特殊的合约才有，所以需要进行判断
    const mintDate = async (
        tokenAddress: `0x${string}`,
        address: string
    ): Promise<number> => {
        try {
            const tx = await readContractERC20('erc20', tokenAddress, 'mintDate', [address]);
            return tx ? Number(tx) : 0;
        } catch (error) {
            console.error('mintDate error:', error);
            return 0;
        }
    };

    // // 这个两个函数可以作为常量定义，不需要进行查询
    // const mintPeriod = async (): Promise<number> => {
    //     try {
    //         return 24*60*60;
    //     } catch (error) {
    //         console.error("mintPeriod error:", error);
    //         return 0;
    //     }
    // };

    // const mintAmount = async (): Promise<number> => {
    //     try {
    //         return 1000;
    //     } catch (error) {
    //         console.error("mintAmount error:", error);
    //         return 0;
    //     }
    // };

    return {
        // 代币授权相关
        allowance,
        balanceOf,
        // 代币基本信息
        decimals,
        name,
        symbol,
        totalSupply,
        // 铸造相关
        mintDate,
        // mintPeriod,
        // mintAmount,
    };
}

