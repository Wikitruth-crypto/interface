import React from 'react';
import { cn } from '@/lib/utils';

const BorderTest: React.FC = () => {
    // shadcn-ui 风格的input/select/textarea类型组件边框样式类
    const borderEffectClass_input = cn(
        // 基础样式
        "border border-input rounded-md transition-[border-color,box-shadow] outline-none",
        // 焦点状态 - 双层效果的关键
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // hover 效果（可选）
        "hover:border-ring/70"
    );

    //shadcn-ui 风格的input/select/textarea类型组件的错误边框样式类
    const destructiveBorderClass_input = cn(
        "border border-destructive/30 rounded-md transition-[border-color,box-shadow] outline-none",
        "focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:ring-[3px]",
        "hover:border-destructive/50"
    );

    // shadcn-ui 风格的card/div边框样式
    const borderEffectClass_card = cn(
        // 基础样式 - card组件使用标准border而非border-input
        "border rounded-lg transition-[border-primary,box-shadow] outline-none shadow-sm",
        // hover 效果 - card通常有hover:shadow增强
        "hover:border-ring/50 hover:border-primary hover:box-shadow-md"
    );

    // shadcn-ui 风格的card/div类型组件的错误边框样式类
    const destructiveBorderClass_card = cn(
        "border border-destructive/40 rounded-lg transition-[border-color,box-shadow] outline-none shadow-sm",
        "hover:border-destructive/60 hover:shadow-md"
    );

    // 不同变体的边框效果
    const primaryBorderClass = cn(
        "border border-primary/30 rounded-md transition-[border-color,box-shadow] outline-none",
        "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px]",
        "hover:border-primary/50"
    );
    

    return (
        <div className="p-8 space-y-8 bg-background text-foreground">
            <h2 className="text-2xl font-bold text-primary mb-6">
                Border Effect Test - shadcn-ui 风格边框效果
            </h2>

            {/* 标准 Input 元素 */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">1. Input 元素</h3>
                <div className="grid gap-4">
                    <input
                        type="text"
                        placeholder="标准 shadcn 风格 input"
                        className={cn(
                            borderEffectClass_input,
                            "px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground"
                        )}
                    />
                    <input
                        type="text"
                        placeholder="主色调边框 input"
                        className={cn(
                            primaryBorderClass,
                            "px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground"
                        )}
                    />
                    <input
                        type="text"
                        placeholder="错误状态边框 input"
                        className={cn(
                            destructiveBorderClass_input,
                            "px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground"
                        )}
                    />
                </div>
            </section>

            {/* Textarea 元素 */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">2. Textarea 元素</h3>
                <div className="grid gap-4">
                    <textarea
                        placeholder="标准 shadcn 风格 textarea"
                        rows={3}
                        className={cn(
                            borderEffectClass_input,
                            "px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                        )}
                    />
                    <textarea
                        placeholder="主色调边框 textarea"
                        rows={3}
                        className={cn(
                            primaryBorderClass,
                            "px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                        )}
                    />
                </div>
            </section>

            {/* Button 元素 */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">3. Button 元素</h3>
                <div className="flex gap-4 flex-wrap">
                    <button
                        className={cn(
                            borderEffectClass_input,
                            "px-4 py-2 bg-transparent text-foreground hover:bg-accent/10"
                        )}
                    >
                        标准边框按钮
                    </button>
                    <button
                        className={cn(
                            primaryBorderClass,
                            "px-4 py-2 bg-transparent text-foreground hover:bg-primary/10"
                        )}
                    >
                        主色调边框按钮
                    </button>
                    <button
                        className={cn(
                            destructiveBorderClass_input,
                            "px-4 py-2 bg-transparent text-foreground hover:bg-destructive/10"
                        )}
                    >
                        错误状态按钮
                    </button>
                </div>
            </section>

            {/* Div 容器元素 */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">4. Div 容器元素</h3>
                <div className="grid gap-4">
                                <div
                tabIndex={0}
                className={cn(
                    borderEffectClass_card,
                    "p-4 bg-card/50 cursor-pointer"
                )}
            >
                <p className="text-foreground">可聚焦的 div 容器 - 点击查看边框效果</p>
                <p className="text-muted-foreground text-sm mt-1">使用 tabIndex={0} 使其可聚焦，card风格边框</p>
            </div>
            <div
                tabIndex={0}
                className={cn(
                    primaryBorderClass,
                    "p-4 bg-primary/5 cursor-pointer"
                )}
            >
                <p className="text-foreground">主色调边框容器</p>
                <p className="text-muted-foreground text-sm mt-1">hover 和 focus 都有效果</p>
            </div>
            <div
                tabIndex={0}
                className={cn(
                    destructiveBorderClass_card,
                    "p-4 bg-destructive/5 cursor-pointer"
                )}
            >
                <p className="text-foreground">错误状态的 div 容器</p>
                <p className="text-muted-foreground text-sm mt-1">card风格的错误状态边框</p>
            </div>
                </div>
            </section>

            {/* Select 元素 */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">5. Select 元素</h3>
                <div className="grid gap-4">
                    <select
                        className={cn(
                            borderEffectClass_input,
                            "px-3 py-2 bg-background text-foreground"
                        )}
                    >
                        <option value="">选择选项...</option>
                        <option value="1">选项 1</option>
                        <option value="2">选项 2</option>
                        <option value="3">选项 3</option>
                    </select>
                    <select
                        className={cn(
                            primaryBorderClass,
                            "px-3 py-2 bg-background text-foreground"
                        )}
                    >
                        <option value="">主色调边框选择器</option>
                        <option value="green">绿色主题</option>
                        <option value="purple">紫色主题</option>
                    </select>
                </div>
            </section>

            {/* 代码说明 */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold">6. 核心样式说明</h3>
                        <div className="bg-card rounded-lg p-4 space-y-4 text-sm">
            <div>
                <p className="font-medium text-primary mb-2">Input类型组件边框效果：</p>
                <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• <code className="text-accent-foreground">border border-input</code> - 基础边框（使用input变量）</li>
                    <li>• <code className="text-accent-foreground">focus-visible:ring-ring/50 ring-[3px]</code> - 外层光晕（50% 透明度，3px宽度）</li>
                    <li>• <code className="text-accent-foreground">transition-[border-color,box-shadow]</code> - 平滑过渡动画</li>
                </ul>
            </div>
            <div>
                <p className="font-medium text-primary mb-2">Card/Div类型组件边框效果：</p>
                <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• <code className="text-accent-foreground">border</code> - 标准边框（使用border变量）</li>
                    <li>• <code className="text-accent-foreground">shadow-sm</code> - 基础阴影效果</li>
                    <li>• <code className="text-accent-foreground">focus-visible:ring-ring/30 ring-[2px]</code> - 更柔和的光晕（30% 透明度，2px宽度）</li>
                    <li>• <code className="text-accent-foreground">hover:shadow-md</code> - hover时阴影增强</li>
                </ul>
            </div>
        </div>
            </section>
        </div>
    );
};

export default BorderTest;
