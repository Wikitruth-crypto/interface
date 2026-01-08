import { useState, useRef, useCallback, useEffect } from 'react';

interface TimerOptions {
    duration: number;           // Timer total duration (milliseconds)
    onTimeout?: () => void;     // Timeout callback
    onTick?: (remainingTime: number) => void;  // Callback for each tick
    autoStart?: boolean;        // Whether to automatically start
    tickInterval?: number;      // Tick interval (milliseconds)
}

interface TimerState {
    isRunning: boolean;         // Whether it is running
    isPaused: boolean;          // Whether it is paused
    remainingTime: number;      // Remaining time
    elapsedTime: number;        // Elapsed time
    isTimeout: boolean;         // Whether it is timeout
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

    // Clear timer
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Start timer
    const start = useCallback(() => {
        if (state.isRunning && !state.isPaused) return;

        clearTimer();
        
        const now = Date.now();
        startTimeRef.current = now;
        
        if (state.isPaused && pausedTimeRef.current) {
            // If it is from the paused state to resume, adjust the start time
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

    // Pause timer
    const pause = useCallback(() => {
        if (!state.isRunning || state.isPaused) return;

        clearTimer();
        pausedTimeRef.current = state.remainingTime;

        setState(prev => ({
            ...prev,
            isPaused: true
        }));
    }, [state.isRunning, state.isPaused]);

    // Continue timer
    const resume = useCallback(() => {
        if (!state.isPaused) return;
        start();
    }, [state.isPaused, start]);

    // Reset timer
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

    // Stop timer
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

    // Set new duration
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

    // Clean up when the component is unloaded
    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    // Automatically start
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
