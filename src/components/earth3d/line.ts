import * as THREE from 'three'
import { lon2xyz } from './math'
import world from './resources/json/world.json'

export async function countryLine(
  R: number, 
  themeColor: number | undefined = undefined
): Promise<THREE.Group> {
  const group = new THREE.Group()
  try {
    // 直接使用导入的 JSON 数据
    const allPointArr: number[] = []
    const color = themeColor || 0x009999
    
    world.features.forEach((country: any) => {
      const geometry = country.geometry
      
      if (geometry.type === 'Polygon') {
        // 单个多边形，包装成数组以统一处理
        processPolygon(geometry.coordinates, R, allPointArr)
      } else if (geometry.type === 'MultiPolygon') {
        // 多个多边形，直接遍历处理
        geometry.coordinates.forEach((polygon: any) => {
          processPolygon(polygon, R, allPointArr)
        })
      }
    })
    
    group.add(line(allPointArr, color))
  } catch (e) {
    console.error('load world.json failed!', e)
  }
  return group
}

// 处理单个多边形的坐标数据
function processPolygon(polygon: any, R: number, allPointArr: number[]): void {
  const pointArr: number[] = []
  
  // 处理多边形的外环（第一个坐标数组）
  polygon[0].forEach((elem: number[]) => {
    const coord = lon2xyz(R, elem[0], elem[1])
    pointArr.push(coord.x, coord.y, coord.z)
  })
  
  // 构建线条段
  if (pointArr.length >= 6) {
    // 添加起始点到第一个点的连接
    allPointArr.push(pointArr[0], pointArr[1], pointArr[2])
    
    // 添加连续的线条段
    for (let i = 3; i < pointArr.length; i += 3) {
      allPointArr.push(
        pointArr[i], pointArr[i + 1], pointArr[i + 2], 
        pointArr[i], pointArr[i + 1], pointArr[i + 2]
      )
    }
    
    // 闭合多边形：连接最后一个点回到起始点
    allPointArr.push(pointArr[0], pointArr[1], pointArr[2])
  }
}

function line(
  pointArr: number[], 
  color: number = 0x009999
): THREE.LineSegments {
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array(pointArr)
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const material = new THREE.LineBasicMaterial({ color }) // 使用传入的颜色参数
  return new THREE.LineSegments(geometry, material)
} 