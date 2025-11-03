import * as THREE from 'three'
import { createRadialGlowSVG } from './svg'

/**
 * 创建地球光圈精灵
 * @param R 地球半径
 * @param themeColor 光圈颜色
 */
export function createEarthSprite(
  R: number,
  themeColor: number | undefined = undefined
): THREE.Sprite {
  // 将十六进制颜色转换为 CSS 颜色字符串
  const color = themeColor || 0x22ffcc
  const colorString = '#' + color.toString(16).padStart(6, '0')
  
  // 使用 SVG 生成的径向渐变纹理替换 PNG
  const texture = new THREE.TextureLoader().load(
    createRadialGlowSVG({
      color: colorString,
      size: 50,
      opacity: 1, // 恢复合适的透明度
    })
  )
  // 创建精灵材质对象
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5, // 恢复原来的透明度
  })
  // 创建精灵模型
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(R * 3.3, R * 3.3, 1) // 增加缩放比例，让光圈更大
  return sprite
} 

