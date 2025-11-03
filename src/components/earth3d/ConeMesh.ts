import * as THREE from 'three'
import { lon2xyz } from './math'

/**
 * 创建球面上的棱锥 Mesh，尺寸与地球半径相关，法线朝外，双锥体叠加
 */
export function createConeMesh(R: number, E: number, N: number): THREE.Mesh {
  // 棱锥尺寸与地球半径关联
  const radius = R / 18
  const height = radius * 4
  // 四棱锥
  const geometry = new THREE.ConeGeometry(radius, height, 4)
  geometry.computeVertexNormals()
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, height / 2)
  const material = new THREE.MeshLambertMaterial({ color: 0x00ffff })
  const mesh = new THREE.Mesh(geometry, material)
  // 叠加一个倒置的棱锥
  const mesh2 = mesh.clone()
  mesh2.scale.z = 0.5
  mesh2.position.z = height * (1 + mesh2.scale.z)
  mesh2.rotateX(Math.PI)
  mesh.add(mesh2)
  // 经纬度转球面坐标
  const { x, y, z } = lon2xyz(R * 1.001, E, N)
  mesh.position.set(x, y, z)
  // mesh姿态设置，法线朝球心
  const coordVec3 = new THREE.Vector3(x, y, z).normalize()
  const meshNormal = new THREE.Vector3(0, 0, 1)
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
  return mesh
} 

