/**
 * 性能监控工具
 * 用于监控组件重构后的性能表现
 */

export interface PerformanceMetrics {
    renderTime: number;
    componentCount: number;
    timestamp: number;
    memoryUsage?: number;
}

export interface ProfilePerformanceData {
    cardRenderTime: number;
    totalCards: number;
    progressiveRevealTime: number;
    lastUpdate: number;
}

class PerformanceMonitor {
    private metrics: PerformanceMetrics[] = [];
    private timers: Map<string, number> = new Map();
    
    /**
     * 开始计时
     */
    startTimer(key: string): void {
        this.timers.set(key, performance.now());
    }
    
    /**
     * 结束计时并记录
     */
    endTimer(key: string, componentCount: number = 1): PerformanceMetrics | null {
        const startTime = this.timers.get(key);
        if (!startTime) {
            console.warn(`Timer '${key}' not found`);
            return null;
        }
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        const metric: PerformanceMetrics = {
            renderTime,
            componentCount,
            timestamp: Date.now(),
            memoryUsage: this.getMemoryUsage()
        };
        
        this.metrics.push(metric);
        this.timers.delete(key);
        
        return metric;
    }
    
    /**
     * 获取内存使用情况
     */
    private getMemoryUsage(): number | undefined {
        if ('memory' in performance) {
            return (performance as any).memory?.usedJSHeapSize;
        }
        return undefined;
    }
    
    /**
     * 获取性能统计
     */
    getStats(): {
        averageRenderTime: number;
        totalMetrics: number;
        slowestRender: PerformanceMetrics | null;
        fastestRender: PerformanceMetrics | null;
    } {
        if (this.metrics.length === 0) {
            return {
                averageRenderTime: 0,
                totalMetrics: 0,
                slowestRender: null,
                fastestRender: null
            };
        }
        
        const renderTimes = this.metrics.map(m => m.renderTime);
        const averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
        
        const slowestRender = this.metrics.reduce((prev, current) => 
            (prev.renderTime > current.renderTime) ? prev : current
        );
        
        const fastestRender = this.metrics.reduce((prev, current) => 
            (prev.renderTime < current.renderTime) ? prev : current
        );
        
        return {
            averageRenderTime,
            totalMetrics: this.metrics.length,
            slowestRender,
            fastestRender
        };
    }
    
    /**
     * 清除所有记录
     */
    clear(): void {
        this.metrics = [];
        this.timers.clear();
    }
    
    /**
     * 导出性能数据
     */
    exportData(): PerformanceMetrics[] {
        return [...this.metrics];
    }
    
    /**
     * 检查性能是否正常
     */
    checkPerformance(thresholds: {
        maxRenderTime?: number;
        maxMemoryUsage?: number;
    } = {}): {
        isHealthy: boolean;
        issues: string[];
    } {
        const { maxRenderTime = 16, maxMemoryUsage = 50 * 1024 * 1024 } = thresholds; // 16ms for 60fps
        const issues: string[] = [];
        
        const stats = this.getStats();
        
        if (stats.averageRenderTime > maxRenderTime) {
            issues.push(`Average render time (${stats.averageRenderTime.toFixed(2)}ms) exceeds threshold (${maxRenderTime}ms)`);
        }
        
        if (stats.slowestRender && stats.slowestRender.renderTime > maxRenderTime * 3) {
            issues.push(`Slowest render (${stats.slowestRender.renderTime.toFixed(2)}ms) is significantly slow`);
        }
        
        const latestMetric = this.metrics[this.metrics.length - 1];
        if (latestMetric?.memoryUsage && latestMetric.memoryUsage > maxMemoryUsage) {
            issues.push(`Memory usage (${(latestMetric.memoryUsage / 1024 / 1024).toFixed(2)}MB) exceeds threshold`);
        }
        
        return {
            isHealthy: issues.length === 0,
            issues
        };
    }
}

// 全局性能监控实例
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * React Hook for performance monitoring
 */
export const usePerformanceMonitor = () => {
    const startRender = (key: string) => {
        globalPerformanceMonitor.startTimer(`render-${key}`);
    };
    
    const endRender = (key: string, componentCount?: number) => {
        return globalPerformanceMonitor.endTimer(`render-${key}`, componentCount);
    };
    
    const getStats = () => {
        return globalPerformanceMonitor.getStats();
    };
    
    const checkHealth = () => {
        return globalPerformanceMonitor.checkPerformance();
    };
    
    return {
        startRender,
        endRender,
        getStats,
        checkHealth
    };
};

/**
 * Profile页面专用性能监控
 */
export class ProfilePerformanceMonitor {
    private static instance: ProfilePerformanceMonitor;
    private data: ProfilePerformanceData = {
        cardRenderTime: 0,
        totalCards: 0,
        progressiveRevealTime: 0,
        lastUpdate: Date.now()
    };
    
    static getInstance(): ProfilePerformanceMonitor {
        if (!ProfilePerformanceMonitor.instance) {
            ProfilePerformanceMonitor.instance = new ProfilePerformanceMonitor();
        }
        return ProfilePerformanceMonitor.instance;
    }
    
    updateCardMetrics(renderTime: number, cardCount: number): void {
        this.data.cardRenderTime = renderTime;
        this.data.totalCards = cardCount;
        this.data.lastUpdate = Date.now();
    }
    
    updateProgressiveRevealTime(time: number): void {
        this.data.progressiveRevealTime = time;
        this.data.lastUpdate = Date.now();
    }
    
    getProfileData(): ProfilePerformanceData {
        return { ...this.data };
    }
    
    generateReport(): string {
        const data = this.getProfileData();
        return `
Performance Report - Profile Page
================================
Cards Rendered: ${data.totalCards}
Card Render Time: ${data.cardRenderTime.toFixed(2)}ms
Progressive Reveal Time: ${data.progressiveRevealTime.toFixed(2)}ms
Average Time per Card: ${data.totalCards > 0 ? (data.cardRenderTime / data.totalCards).toFixed(2) : 'N/A'}ms
Last Update: ${new Date(data.lastUpdate).toLocaleString()}

Recommendations:
${data.cardRenderTime > 100 ? '⚠️  Consider optimizing card rendering' : '✅ Card rendering is efficient'}
${data.progressiveRevealTime > 1000 ? '⚠️  Progressive reveal might be too slow' : '✅ Progressive reveal timing is good'}
${data.totalCards > 50 ? '⚠️  Consider virtual scrolling for large lists' : '✅ Card count is manageable'}
        `.trim();
    }
}

// 开发环境下的性能调试工具
if (process.env.NODE_ENV === 'development') {
    (window as any).__PROFILE_PERFORMANCE__ = {
        monitor: globalPerformanceMonitor,
        profileMonitor: ProfilePerformanceMonitor.getInstance(),
        getReport: () => ProfilePerformanceMonitor.getInstance().generateReport()
    };
} 