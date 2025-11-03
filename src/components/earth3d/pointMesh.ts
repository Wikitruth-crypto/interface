import * as THREE from 'three'
import { lon2xyz } from './math'
import meshTexture from './resources/static/mesh.png'

/**
 * 创建球面上的标注点（带贴图的平面，法线朝外）
 * @param R 球半径
 * @param E 经度
 * @param N 纬度
 * @param size 点的缩放（可选，默认1）
 */
export function createPointMesh(
  R: number, 
  E: number, 
  N: number, 
  size = 1, 
  themeColor: string | number | undefined = undefined
): THREE.Mesh {
  // 贴图路径适配 public 目录(nextjs)
  // const texture = new THREE.TextureLoader().load('./resources/static/mesh.png')
  const texture = new THREE.TextureLoader().load(meshTexture)
  // 平面几何体
  const geometry = new THREE.PlaneGeometry(R * 0.05 * size, R * 0.05 * size)
  const color = themeColor || 0x22ffcc
  const material = new THREE.MeshBasicMaterial({
    color: color,
    map: texture,
    transparent: true,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  // 经纬度转球面坐标
  const { x, y, z } = lon2xyz(R * 1.001, E, N)
  mesh.position.set(x, y, z)
  // 让平面法线朝向球心
  const coordVec3 = new THREE.Vector3(x, y, z).normalize()
  const meshNormal = new THREE.Vector3(0, 0, 1)
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  return mesh
} 