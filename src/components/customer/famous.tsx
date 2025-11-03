"use client"

import { useState, useEffect } from 'react'
import famous from '@/assets/data/famous'
import { cn } from '@/lib/utils';

/***
 * 这是一个名言轮播组件，每间隔15秒，就随机切换一组
 * 动画效果：淡入淡出，从左至右（透明度变化）
 * 
 */

interface Props {
    textDirection?:'left'|'right'|'default'; // 两行靠左、靠右、第一行靠左，第二行靠右
    fontSize?: number;
    fontColor?: string;
    className?: string;
    autoPlay?: boolean; // 是否自动播放
    interval?: number; // 切换间隔（毫秒）
}

export default function Famous({
    textDirection = 'default',
    fontSize = 16,
    fontColor = 'white',
    className,
    autoPlay = true,
    interval = 10000
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const [nextQuote, setNextQuote] = useState(famous[0])
    const [mounted, setMounted] = useState(false)

    // 随机选择下一个名言
    const getRandomQuote = () => {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * famous.length)
        } while (randomIndex === currentIndex && famous.length > 1)
        return { index: randomIndex, quote: famous[randomIndex] }
    }

    // 切换到下一个名言
    const switchToNext = () => {
        setIsVisible(false)
        
        setTimeout(() => {
            const { index, quote } = getRandomQuote()
            setCurrentIndex(index)
            setNextQuote(quote)
            setIsVisible(true)
        }, 300) // 等待淡出动画完成
    }

    // 确保只在客户端执行
    useEffect(() => {
        setMounted(true)
    }, [])

    // 自动轮播逻辑
    useEffect(() => {
        if (!autoPlay || !mounted) return

        const timer = setInterval(() => {
            switchToNext()
        }, interval)

        return () => clearInterval(timer)
    }, [autoPlay, interval, currentIndex, mounted])

    // 初始化随机名言（只在客户端）
    useEffect(() => {
        if (mounted) {
            const { quote } = getRandomQuote()
            setNextQuote(quote)
        }
    }, [mounted])

    // 根据 textDirection 获取对齐样式
    const getTextAlignment = () => {
        switch (textDirection) {
            case 'left':
                return {
                    proverb: 'text-left',
                    author: 'text-left'
                }
            case 'right':
                return {
                    proverb: 'text-right',
                    author: 'text-right'
                }
            case 'default':
            default:
                return {
                    proverb: 'text-left',
                    author: 'text-right'
                }
        }
    }

    const alignment = getTextAlignment()

    return (
        <div 
            className={cn(
                "flex-1 transition-all duration-300 ease-in-out",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                className
            )}
            style={{ 
                fontSize: `${fontSize}px`,
                color: fontColor 
            }}
        >
            {/* 名言内容 */}
            <p 
                className={cn(
                    "leading-relaxed mb-2 transition-all duration-300",
                    "italic ",
                    alignment.proverb
                )}
                style={{ 
                    fontSize: `${fontSize}px`,
                    color: fontColor 
                }}
            >
                "{nextQuote.proverb}"
            </p>
            
            {/* 作者/出处 */}
            <p 
                className={cn(
                    "text-sm opacity-60 transition-all duration-300",
                    alignment.author
                )}
                style={{ 
                    fontSize: `${fontSize * 0.875}px`,
                    color: fontColor 
                }}
            >
                —— {nextQuote.from}
            </p>

            {/* 手动切换按钮（可选） */}
            {!autoPlay && (
                <button
                    onClick={switchToNext}
                    className="mt-4 px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                    style={{ color: fontColor }}
                >
                    下一句
                </button>
            )}
        </div>
    )
}


