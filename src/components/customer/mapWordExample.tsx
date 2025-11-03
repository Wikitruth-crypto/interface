'use client';

import React from 'react';
import MapWord from './mapWord';

export default function MapWordExample() {
    return (
        <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold text-center mb-8">艺术字地图轮廓组件示例</h1>

            {/* 基础用法 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">基础用法</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="md" opacity={0.3} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg font-semibold text-white">标准版本</p>
                        </div>
                    </div>

                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map2" size="md" opacity={0.4} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg font-semibold text-white">密集版本</p>
                        </div>
                    </div>

                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map3" size="md" opacity={0.3} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg font-semibold text-white">螺旋版本</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 不同尺寸 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">不同尺寸</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="sm" opacity={0.4} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">小尺寸</p>
                        </div>
                    </div>

                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="md" opacity={0.4} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">中尺寸</p>
                        </div>
                    </div>

                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="lg" opacity={0.4} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">大尺寸</p>
                        </div>
                    </div>

                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="xl" opacity={0.4} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">超大尺寸</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 不同透明度 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">不同透明度</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="md" opacity={0.1} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">10% 透明度</p>
                        </div>
                    </div>

                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="md" opacity={0.3} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">30% 透明度</p>
                        </div>
                    </div>

                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="md" opacity={0.6} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">60% 透明度</p>
                        </div>
                    </div>

                    <div className="relative h-48 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="md" opacity={0.9} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">90% 透明度</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 动画效果 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">动画效果</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map1" size="lg" opacity={0.4} animated />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg font-semibold text-white">脉冲动画</p>
                        </div>
                    </div>

                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map2" size="lg" opacity={0.4} animated blur />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg font-semibold text-white">动画 + 模糊</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 实际应用场景 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">实际应用场景</h2>

                {/* 仪表板背景 */}
                <div className="relative h-80 border rounded-lg overflow-hidden bg-black">
                    <MapWord type="map1" size="lg" opacity={0.1} className="absolute inset-0" />
                    <div className="absolute inset-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">仪表板背景</h3>
                        <p className="text-gray-300 mb-4">艺术字地图作为背景装饰，不影响内容可读性</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="text-white font-semibold">数据卡片 1</h4>
                                <p className="text-gray-300">内容示例</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="text-white font-semibold">数据卡片 2</h4>
                                <p className="text-gray-300">内容示例</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="text-white font-semibold">数据卡片 3</h4>
                                <p className="text-gray-300">内容示例</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 卡片背景 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map2" size="md" opacity={0.3} className="absolute inset-0" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-white mb-2">卡片背景</h3>
                            <p className="text-gray-300">使用艺术字地图作为卡片背景装饰</p>
                        </div>
                    </div>

                    <div className="relative h-64 border rounded-lg overflow-hidden bg-black">
                        <MapWord type="map3" size="md" opacity={0.25} animated className="absolute inset-0" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-white mb-2">动态背景</h3>
                            <p className="text-gray-300">带动画效果的艺术字地图背景</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 配置说明 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">配置说明</h2>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">组件属性</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>type:</strong> 'standard' | 'dense' | 'spiral' - 地图样式类型</p>
                        <p><strong>size:</strong> 'sm' | 'md' | 'lg' | 'xl' - 字体大小</p>
                        <p><strong>opacity:</strong> 0-1 - 透明度控制</p>
                        <p><strong>animated:</strong> boolean - 是否启用脉冲动画</p>
                        <p><strong>blur:</strong> boolean - 是否启用模糊效果</p>
                        <p><strong>className:</strong> string - 自定义样式类</p>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-4">使用示例</h3>
                    <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded text-xs overflow-x-auto">
                        {`// 基础用法
<MapWord type="standard" size="md" opacity={0.3} />

// 带动画效果
<MapWord type="dense" size="lg" opacity={0.4} animated />

// 作为背景
<MapWord type="spiral" size="md" opacity={0.2} className="absolute inset-0" />

// 完整配置
<MapWord 
  type="standard" 
  size="xl" 
  opacity={0.5} 
  animated 
  blur 
  className="absolute inset-0 pointer-events-none" 
/>`}
                    </pre>
                </div>
            </section>
        </div>
    );
} 