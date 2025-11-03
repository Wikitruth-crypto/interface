import React from 'react';
import SkeletonCard from './base/skeletonCard';
import SkeletonProfile from './base/skeletonProfile';
import { 
    Skeleton, 
    SkeletonLine, 
    SkeletonCircle, 
    SkeletonBlock, 
    SkeletonParagraph, 
    SkeletonButton, 
    SkeletonAvatar 
} from './base/skeletonBase';

const SkeletonExample: React.FC = () => {
    return (
        <div className="p-8 space-y-8 bg-gray-20 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                骨架屏组件重构示例
            </h1>

            {/* 基础骨架组件展示 */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">基础骨架组件</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 线条骨架 */}
                    <div className="bg-white/20 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">线条骨架</h3>
                        <div className="space-y-3">
                            <SkeletonLine height="0.75rem" />
                            <SkeletonLine height="1rem" width="80%" />
                            <SkeletonLine height="0.5rem" width="60%" />
                        </div>
                    </div>

                    {/* 圆形骨架 */}
                    <div className="bg-white/20 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">圆形骨架</h3>
                        <div className="flex items-center space-x-4">
                            <SkeletonCircle size="2rem" />
                            <SkeletonCircle size="3rem" />
                            <SkeletonCircle size="4rem" />
                        </div>
                    </div>

                    {/* 头像骨架 */}
                    <div className="bg-white/20 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">头像骨架</h3>
                        <div className="flex items-center space-x-4">
                            <SkeletonAvatar size="sm" />
                            <SkeletonAvatar size="md" />
                            <SkeletonAvatar size="lg" />
                            <SkeletonAvatar size="xl" />
                        </div>
                    </div>

                    {/* 按钮骨架 */}
                    <div className="bg-white/20 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">按钮骨架</h3>
                        <div className="space-y-3">
                            <SkeletonButton width="6rem" />
                            <SkeletonButton width="8rem" height="3rem" />
                            <SkeletonButton width="10rem" height="2rem" />
                        </div>
                    </div>

                    {/* 段落骨架 */}
                    <div className="bg-white/20 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">段落骨架</h3>
                        <div className="space-y-4">
                            <SkeletonParagraph lines={2} />
                            <SkeletonParagraph lines={4} />
                        </div>
                    </div>

                    {/* 块状骨架 */}
                    <div className="bg-white/20 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">块状骨架</h3>
                        <div className="space-y-3">
                            <SkeletonBlock height="3rem" />
                            <SkeletonBlock height="2rem" width="70%" />
                            <SkeletonBlock height="4rem" rounded={false} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 卡片骨架展示 */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">卡片骨架屏</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </section>

            {/* 资料卡片骨架展示 */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">资料卡片骨架屏</h2>
                
                <div className="space-y-4">
                    <SkeletonProfile />
                    <SkeletonProfile />
                    <SkeletonProfile />
                </div>
            </section>

            {/* 响应式测试 */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">响应式测试</h2>
                <p className="text-gray-600">
                    调整浏览器窗口大小可以看到骨架屏组件的响应式效果
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonCard />
                    <SkeletonProfile />
                </div>
            </section>

            {/* 无动画版本 */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">静态版本（无动画）</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonCard animate={false} />
                    <SkeletonProfile animate={false} />
                </div>
            </section>

            {/* 自定义样式 */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">自定义样式</h2>
                
                <div className="bg-white/20 p-6 rounded-lg shadow-sm">
                    <div className="space-y-4">
                        {/* 带背景色的骨架 */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">不同颜色</h3>
                            <SkeletonLine className="bg-blue-200" />
                            <SkeletonLine className="bg-green-200" />
                            <SkeletonLine className="bg-purple-200" />
                        </div>

                        {/* 不同圆角 */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">不同圆角</h3>
                            <SkeletonBlock className="rounded-none" />
                            <SkeletonBlock className="rounded-lg" />
                            <SkeletonBlock className="rounded-full" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SkeletonExample; 