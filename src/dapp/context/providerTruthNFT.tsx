// "use client";

// import { ContractFunctionParams } from './provider';

// export function useProviderTruthNFT(contract: (params: ContractFunctionParams) => Promise<any>) {
//     // 基本信息查询
//     const name = async (): Promise<string> => {
//         try {
//             const tx = await contract({
//                 functionName: "name",
//                 methodType: "read_truthNFT",
//             });
//             return tx || '';
//         } catch (error) {
//             console.error("name error:", error);
//             return '';
//         }
//     };

//     const symbol = async (): Promise<string> => {
//         try {
//             const tx = await contract({
//                 functionName: "symbol",
//                 methodType: "read_truthNFT",
//             });
//             return tx || '';
//         } catch (error) {
//             console.error("symbol error:", error);
//             return '';
//         }
//     };

//     const logoURI = async (): Promise<string> => {
//         try {
//             const tx = await contract({
//                 functionName: "logoURI",
//                 methodType: "read_truthNFT",
//                 args: [],
//             });
//             return tx || '';
//         } catch (error) {
//             console.error("logoURI error:", error);
//             return '';
//         }
//     };

//     const tokenURI = async (id: number | string): Promise<string> => {
//         try {
//             const tx = await contract({
//                 functionName: "tokenURI",
//                 methodType: "read_truthNFT",
//                 args: [id],
//             });
//             return tx || '';
//         } catch (error) {
//             console.error("tokenURI error:", error);
//             return '';
//         }
//     };

//     // 计数器查询
//     const totalSupply = async (): Promise<number> => {
//         try {
//             const tx = await contract({
//                 functionName: "totalSupply",
//                 methodType: "read_truthNFT",
//             });
//             return tx ? parseInt(tx.toString()) : 0;
//         } catch (error) {
//             console.error("totalSupply error:", error);
//             return 0;
//         }
//     };

//     // 所有权相关查询
//     const ownerOf = async (id: number | string): Promise<string> => {
//         try {
//             const tx = await contract({
//                 functionName: "ownerOf",
//                 methodType: "read_truthNFT",
//                 args: [id],
//             });
//             return tx || '';
//         } catch (error) {
//             console.error("ownerOf error:", error);
//             return '';
//         }
//     };

//     const balanceOf = async (address: string): Promise<number> => {
//         try {
//             const tx = await contract({
//                 functionName: "balanceOf",
//                 methodType: "read_truthNFT",
//                 args: [address],
//             });
//             return tx ? parseInt(tx.toString()) : 0;
//         } catch (error) {
//             console.error("balanceOf error:", error);
//             return 0;
//         }
//     };

//     // const supportsInterface = async (interfaceId: string): Promise<boolean> => {
//     //     try {
//     //         const tx = await contract({
//     //             functionName: "supportsInterface",
//     //             methodType: "read_truthBox",
//     //             args: [interfaceId],
//     //         });
//     //         return tx || false;
//     //     } catch (error) {
//     //         console.error("supportsInterface error:", error);
//     //         return false;
//     //     }
//     // };

//     return {
//         // 基本信息
//         name,
//         symbol,
//         logoURI,
//         tokenURI,
//         totalSupply,
//         ownerOf,
//         balanceOf,
//     };
// }
