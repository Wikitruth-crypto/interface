import React, { useRef, useEffect } from 'react'
import { Earth3DCore } from './earth3dCore'

interface Earth3DProps {
  className?: string
  style?: React.CSSProperties
  // 是否禁止缩放
  isDisableZoom?: boolean
  // 是否禁止旋转
  isDisableRotate?: boolean
  // 是否禁止鼠标控制
  isDisableMouseControl?: boolean
  // 主题色
  themeColor?: string
  // 是否开启光圈等级
  isWaveLevelOpen?: boolean
}


/**
 * Earth3D 组件：在 React/Next.js 中直接使用的 3D 地球可视化组件
 */
const Earth3D: React.FC<Earth3DProps> = ({ 
  className = '', 
  style = {}, 
  isDisableZoom = false, 
  isDisableRotate = false,
  isDisableMouseControl = false,
  themeColor,
  isWaveLevelOpen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<Earth3DCore | null>(null)

  useEffect(() => {
    // 初始化 Three.js 地球主类
    if (containerRef.current && !coreRef.current) {
      coreRef.current = new Earth3DCore(containerRef.current, {
        isDisableZoom,
        isDisableRotate,
        isDisableMouseControl,
        themeColor,
        isWaveLevelOpen
      })
    }
    // 卸载时清理资源
    return () => {
      if (coreRef.current) {
        coreRef.current.dispose()
        coreRef.current = null
      }
    }
  }, [isDisableZoom, isDisableRotate, isDisableMouseControl, themeColor, isWaveLevelOpen])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={style}
    />
  )
}

export default Earth3D 