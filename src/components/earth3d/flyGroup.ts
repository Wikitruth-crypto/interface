
import * as THREE from 'three'
// import { flyArc } from './flyArc'
import { createPointMesh } from './pointMesh'
import { createWaveMesh } from './WaveMesh'
// import { createConeMesh } from './ConeMesh'
import config from './config'
// import { ColorType } from './earth3dCore'

// 示例数据结构，实际可根据需要调整
export interface FlyData {
  color: number,
  start: { E: number; N: number }
  endArr: { E: number; N: number; size: number; levelColor?: number }[]
}

/**
 * 批量组装飞线、点、光圈、锥体等特效
 */
export function createFlyGroup(data: FlyData) {
  const R = config.R
  const group = new THREE.Group()
  // const flyArr: THREE.Group[] = [] // 所有飞线集合
  const waveArr: THREE.Mesh[] = [] // 所有波动光圈集合
  // 起点静态圆点
  const startMesh = createPointMesh(R , data.start.E, data.start.N, 1, data.color)
  group.add(startMesh)
  // 起点波动光圈
  const startWaveMesh = createWaveMesh(R , data.start.E, data.start.N, 1, data.color)
  group.add(startWaveMesh)
  waveArr.push(startWaveMesh)
  // 起点棱锥
  // const coneMesh = createConeMesh(R, data.start.E, data.start.N)
  // group.add(coneMesh)
  // 批量添加终点飞线、点、光圈
  data.endArr.forEach(coord => {
    // 飞线
    // const arcGroup = flyArc(data.start.E, data.start.N, coord.E, coord.N)
    // group.add(arcGroup)
    // flyArr.push(arcGroup)
    // 终点静态圆点
    const pointColor = coord.levelColor || data.color // 使用等级颜色或默认颜色
    const mesh = createPointMesh(R, coord.E, coord.N, coord.size, pointColor)
    group.add(mesh)
    // 终点波动光圈
    const waveMesh = createWaveMesh(R, coord.E, coord.N, coord.size, pointColor)
    group.add(waveMesh)
    waveArr.push(waveMesh)
  })
  return { 
    group, 
    // flyArr, 
    waveArr, 
    // coneMesh 
  }
} 
