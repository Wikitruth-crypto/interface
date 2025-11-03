import { useState, useRef, useCallback, useEffect } from 'react';

interface TimerOptions {
    duration: number;           // 计时器总时长（毫秒）
    onTimeout?: () => void;     // 超时回调
    onTick?: (remainingTime: number) => void;  // 每次tick的回调
    autoStart?: boolean;        // 是否自动开始
    tickInterval?: number;      // tick间隔（毫秒）
}

interface TimerState {
    isRunning: boolean;         // 是否正在运行
    isPaused: boolean;          // 是否暂停
    remainingTime: number;      // 剩余时间
    elapsedTime: number;        // 已经过时间
    isTimeout: boolean;         // 是否超时
}

export const useTimer = ({
    duration,
    onTimeout,
    onTick,
    autoStart = false,
    tickInterval = 1000
}: TimerOptions) => {
    const [state, setState] = useState<TimerState>({
        isRunning: false,
        isPaused: false,
        remainingTime: duration,
        elapsedTime: 0,
        isTimeout: false
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const pausedTimeRef = useRef<number | null>(null);

    // 清除计时器
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // 开始计时
    const start = useCallback(() => {
        if (state.isRunning && !state.isPaused) return;

        clearTimer();
        
        const now = Date.now();
        startTimeRef.current = now;
        
        if (state.isPaused && pausedTimeRef.current) {
            // 如果是从暂停状态恢复，调整开始时间
            startTimeRef.current = now - (duration - state.remainingTime);
        }

        setState(prev => ({
            ...prev,
            isRunning: true,
            isPaused: false,
            isTimeout: false
        }));

        timerRef.current = setInterval(() => {
            const currentTime = Date.now();
            const elapsed = currentTime - (startTimeRef.current || currentTime);
            const remaining = Math.max(0, duration - elapsed);

            setState(prev => ({
                ...prev,
                remainingTime: remaining,
                elapsedTime: elapsed,
                isTimeout: remaining === 0
            }));

            onTick?.(remaining);

            if (remaining === 0) {
                clearTimer();
                onTimeout?.();
            }
        }, tickInterval);
    }, [duration, onTick, onTimeout, state.isPaused, state.isRunning, tickInterval]);

    // 暂停计时
    const pause = useCallback(() => {
        if (!state.isRunning || state.isPaused) return;

        clearTimer();
        pausedTimeRef.current = state.remainingTime;

        setState(prev => ({
            ...prev,
            isPaused: true
        }));
    }, [state.isRunning, state.isPaused]);

    // 继续计时
    const resume = useCallback(() => {
        if (!state.isPaused) return;
        start();
    }, [state.isPaused, start]);

    // 重置计时器
    const reset = useCallback(() => {
        clearTimer();
        startTimeRef.current = null;
        pausedTimeRef.current = null;

        setState({
            isRunning: false,
            isPaused: false,
            remainingTime: duration,
            elapsedTime: 0,
            isTimeout: false
        });
    }, [duration]);

    // 停止计时器
    const stop = useCallback(() => {
        clearTimer();
        startTimeRef.current = null;
        pausedTimeRef.current = null;

        setState({
            isRunning: false,
            isPaused: false,
            remainingTime: duration,
            elapsedTime: 0,
            isTimeout: false
        });
    }, [duration]);

    // 设置新的持续时间
    const setDuration = useCallback((newDuration: number) => {
        clearTimer();
        startTimeRef.current = null;
        pausedTimeRef.current = null;

        setState(prev => ({
            ...prev,
            remainingTime: newDuration,
            elapsedTime: 0,
            isTimeout: false
        }));
    }, []);

    // 组件卸载时清理
    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    // 自动开始
    useEffect(() => {
        if (autoStart) {
            start();
        }
    }, [autoStart, start]);

    return {
        ...state,
        start,
        pause,
        resume,
        reset,
        stop,
        setDuration,
        clearTimer
    };
};
