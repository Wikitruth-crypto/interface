// 'use client';

// import { useEffect } from 'react';
// import { useAccount} from 'wagmi';
// import { Address_0} from '@/dapp/constants/addressRoles';
// import { useAccountStore } from '@/dapp/store/accountStore';


// export const useUpdateAccount = () => {
//     const { address, isConnected } = useAccount();
//     const { setCurrentAccount, initAccount} = useAccountStore();
//     // const chainId = useChainId();
//     // const publicClient = usePublicClient();

//     useEffect(() => {

//         if (address && isConnected && address !== Address_0) {
//             setCurrentAccount(address.toLowerCase());
//             initAccount(address.toLowerCase());
//         } else {
//             setCurrentAccount(null);
//             initAccount('');
//         }
//     }, [address, isConnected]);

// };
