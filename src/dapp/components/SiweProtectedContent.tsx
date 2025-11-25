// import React, { useEffect, ReactNode } from 'react';
// import { useSiweAuth } from '@dapp/hooks/SiweAuth';
// import { SiweLoginButton } from './SiweLoginButton';

// /**
//  * SIWE 受保护内容组件属性
//  */
// export interface SiweProtectedContentProps {
//     /** 需要保护的内容 */
//     children: ReactNode;
//     /** 未登录时显示的内容（可选） */
//     fallback?: ReactNode;
//     /** 是否自动验证会话 */
//     autoValidate?: boolean;
//     /** 验证间隔（毫秒），默认5分钟 */
//     validateInterval?: number;
// }

// export const SiweProtectedContent: React.FC<SiweProtectedContentProps> = ({
//     children,
//     fallback,
//     autoValidate = true,
//     validateInterval = 5 * 60 * 1000 // 默认5分钟
// }) => {
//     const { session, validateSession, logout } = useSiweAuth();

//     // 自动验证会话
//     useEffect(() => {
//         if (!autoValidate || !session.token) {
//             return;
//         }

//         // 立即验证一次
//         const checkSession = async () => {
//             const isValid = await validateSession();
//             if (!isValid) {
//                 console.log('会话已失效，请重新登录');
//             }
//         };

//         checkSession();

//         // 定期验证
//         const interval = setInterval(checkSession, validateInterval);

//         return () => clearInterval(interval);
//     }, [session.token, autoValidate, validateInterval, validateSession]);

//     // 未登录状态
//     if (!session.isLoggedIn) {
//         return (
//             <div className="flex flex-col items-center justify-center p-8 gap-4">
//                 {fallback || (
//                     <>
//                         <div className="text-center">
//                             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                                 需要登录
//                             </h3>
//                             <p className="text-gray-600 dark:text-gray-400">
//                                 请使用钱包登录以查看此内容
//                             </p>
//                         </div>
//                         <SiweLoginButton showAddress={true} />
//                     </>
//                 )}
//             </div>
//         );
//     }

//     // 已登录，显示内容
//     return <>{children}</>;
// };

// /**
//  * 会话信息显示组件
//  */
// export const SiweSessionInfo: React.FC = () => {
//     const { session, validateSession } = useSiweAuth();
//     const [isValidating, setIsValidating] = React.useState(false);
//     const [lastValidated, setLastValidated] = React.useState<Date | null>(null);

//     const handleValidate = async () => {
//         setIsValidating(true);
//         const isValid = await validateSession();
//         setLastValidated(new Date());
//         setIsValidating(false);
        
//         if (isValid) {
//             alert('会话有效！');
//         } else {
//             alert('会话已失效，请重新登录');
//         }
//     };

//     if (!session.isLoggedIn) {
//         return null;
//     }

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
//             <h4 className="font-semibold text-gray-900 dark:text-white">
//                 会话信息
//             </h4>
            
//             <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                     <span className="text-gray-600 dark:text-gray-400">地址:</span>
//                     <span className="font-mono text-gray-900 dark:text-white">
//                         {session.address && (
//                             <>
//                                 {session.address.slice(0, 6)}...{session.address.slice(-4)}
//                             </>
//                         )}
//                     </span>
//                 </div>
                
//                 <div className="flex justify-between">
//                     <span className="text-gray-600 dark:text-gray-400">过期时间:</span>
//                     <span className="text-gray-900 dark:text-white">
//                         {session.expiresAt?.toLocaleString('zh-CN')}
//                     </span>
//                 </div>
                
//                 {lastValidated && (
//                     <div className="flex justify-between">
//                         <span className="text-gray-600 dark:text-gray-400">上次验证:</span>
//                         <span className="text-gray-900 dark:text-white">
//                             {lastValidated.toLocaleTimeString('zh-CN')}
//                         </span>
//                     </div>
//                 )}
//             </div>
            
//             <button
//                 onClick={handleValidate}
//                 disabled={isValidating}
//                 className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white
//                          rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50
//                          transition-colors text-sm"
//             >
//                 {isValidating ? '验证中...' : '验证会话'}
//             </button>
//         </div>
//     );
// };

