// 'use client';

// import { useReadContract } from './useReadContract';
// import { ContractName } from '@dapp/contractsConfig';

// /**
//  */
// export function useAddressManager() {
//     const { readContract } = useReadContract();

//     // function getTokenList() external view returns (address[] memory);
//     const getTokenList = async (): Promise<string[]> => {
//         try {
//             const tx = await readContract({
//                 contractName: ContractName.ADDRESS_MANAGER,
//                 functionName: 'getTokenList',
//                 args: [],
//             });
//             return tx && Array.isArray(tx) ? tx : [];
//         } catch (error) {
//             console.error('getTokenList error:', error);
//             return [];
//         }
//     };

//     // function getTokenByIndex(uint256 index_) external view returns (address);
//     const getTokenByIndex = async (index: number): Promise<string> => {
//         try {
//             const tx = await readContract({
//                 contractName: ContractName.ADDRESS_MANAGER,
//                 functionName: 'getTokenByIndex',
//                 args: [index],
//             });
//             return tx ? String(tx) : '';
//         } catch (error) {
//             console.error('getTokenByIndex error:', error);
//             return '';
//         }
//     };

//     // function officialToken() external view returns (address);
//     const officialToken = async (): Promise<string> => {
//         try {
//             const tx = await readContract({
//                 contractName: ContractName.ADDRESS_MANAGER,
//                 functionName: 'officialToken',
//                 args: [],
//             });
//             return tx ? String(tx) : '';
//         } catch (error) {
//             console.error('officialToken error:', error);
//             return '';
//         }
//     };

//     // function isTokenSupported(address token_) external view returns (bool);
//     const isTokenSupported = async (token: string): Promise<boolean> => {
//         try {
//             const tx = await readContract({
//                 contractName: ContractName.ADDRESS_MANAGER,
//                 functionName: 'isTokenSupported',
//                 args: [token],
//             });
//             return tx ? Boolean(tx) : false;
//         } catch (error) {
//             console.error('isTokenSupported error:', error);
//             return false;
//         }
//     };

//     // function isOfficialToken(address token_) external view returns (bool);
//     const isOfficialToken = async (token: string): Promise<boolean> => {
//         try {
//             const tx = await readContract({
//                 contractName: ContractName.ADDRESS_MANAGER,
//                 functionName: 'isOfficialToken',
//                 args: [token],
//             });
//             return tx ? Boolean(tx) : false;
//         } catch (error) {
//             console.error('isOfficialToken error:', error);
//             return false;
//         }
//     };

//     return {
//         getTokenList,
//         getTokenByIndex,
//         officialToken,
//         isTokenSupported,
//         isOfficialToken,
//     };
// }

