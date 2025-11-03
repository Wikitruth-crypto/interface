/**
 * 创建可配置颜色的 SVG 径向渐变光圈
 * 用于替代 PNG 图片，提供更好的性能和可定制性
 */

export interface RadialGlowOptions {
    color?: string 
    size?: number 
    opacity?: number 
    // blur?: number 
}

/**
 * 生成 SVG 径向渐变光圈的 data URL
 */
export function createRadialGlowSVG(options: RadialGlowOptions = {}): string {
    const {
        color = '#22ffcc',
        size = 100,
        opacity = 0.8,
        // blur = 20
    } = options

    // 修复渐变方向：从中心100%透明度向周围0%透明度
    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
          <stop offset="30%" stop-color="${color}" stop-opacity="${opacity * 0.7}"/>
          <stop offset="60%" stop-color="${color}" stop-opacity="${opacity * 0.3}"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#radialGlow)"/>
    </svg>
  `

    return `data:image/svg+xml;base64,${btoa(svg.trim())}`
}

/**
 * 创建 Three.js 纹理加载器可用的 SVG 纹理
 */
export function createRadialGlowTexture(options: RadialGlowOptions = {}): string {
    return createRadialGlowSVG(options)
}

