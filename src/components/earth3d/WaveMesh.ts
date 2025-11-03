import * as THREE from 'three'
import { lon2xyz } from './math'
import waveMesh from './resources/static/waveMesh.png'

// export interface WaveMeshOptions {
//   color?: number
//   size?: number
//   opacity?: number
// }

/**
 * 创建球面上的波动光圈（Mesh），法线朝外，动画属性与原生一致
 */
export function createWaveMesh(
  R: number, 
  E: number, 
  N: number, 
  size = 1,
  themeColor: number | undefined = undefined
): THREE.Mesh {
  // 贴图路径适配 public 目录
  // const texture = new THREE.TextureLoader().load('./resources/static/waveMesh.png')
  const texture = new THREE.TextureLoader().load(waveMesh)
  // 平面几何体，尺寸与地球半径相关
  const geometry = new THREE.PlaneGeometry(R * 0.16 * size, R * 0.16 * size)
  const color = themeColor || 0x22ffcc
  const material = new THREE.MeshBasicMaterial({
    color: color, // themeColor default 0x22ffcc
    map: texture,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  // 经纬度转球面坐标
  const { x, y, z } = lon2xyz(R , E, N)
  mesh.position.set(x, y, z)
  // mesh姿态设置，法线朝球心
  const coordVec3 = new THREE.Vector3(x, y, z).normalize()
  const meshNormal = new THREE.Vector3(0, 0, 1)
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  // 动画属性
  // ;(mesh as any).size = R * 0.16 * size
  ;(mesh as any).size = 1.0 // 固定为1
  // ;(mesh as any)._s = Math.random() * 1.0 + 1.0
  ;(mesh as any)._s = Math.random() * 1.0 + 1.0
  return mesh
} 


// mesh._s += 0.007
// mesh.scale.set(mesh.size * mesh._s, mesh.size * mesh._s, mesh.size * mesh._s)
// if (mesh._s <= 1.5) {
//   mesh.material.opacity = (mesh._s - 1) * 2
// } else if (mesh._s > 1.5 && mesh._s <= 2) {
//   mesh.material.opacity = 1 - (mesh._s - 1.5) * 2
// } else {
//   mesh._s = 1.0
// }
