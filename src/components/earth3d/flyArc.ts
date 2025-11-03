import * as THREE from 'three'
import { lon2xyz } from './math'

/**
 * 计算球面上两点间的飞线圆弧轨迹
 * @param startE 起点经度
 * @param startN 起点纬度
 * @param endE 终点经度
 * @param endN 终点纬度
 * @returns 飞线Group，包含飞线Mesh和动画属性
 */
export function flyArc(
    startE: number, 
    startN: number, 
    endE: number, 
    endN: number,
    color: number = 0xffff00
): THREE.Group {
    const group = new THREE.Group()
    const R = 150 // 球半径，建议与 config.R 保持一致
    // 计算起点和终点球面坐标
    const start = lon2xyz(R, startE, startN)
    const end = lon2xyz(R, endE, endN)
    // 控制点（球心上方，决定弧线高度）
    const control = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2 + R * 0.6, // 可调节弧线高度
        z: (start.z + end.z) / 2,
    }
    // 采样点数
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= 100; i++) {
        const t = i / 100
        // 二次贝塞尔插值
        const x = (1 - t) * (1 - t) * start.x + 2 * t * (1 - t) * control.x + t * t * end.x
        const y = (1 - t) * (1 - t) * start.y + 2 * t * (1 - t) * control.y + t * t * end.y
        const z = (1 - t) * (1 - t) * start.z + 2 * t * (1 - t) * control.z + t * t * end.z
        points.push(new THREE.Vector3(x, y, z))
    }
    // 创建飞线几何体
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7 })
    const line = new THREE.Line(geometry, material)
    group.add(line)
        // 可扩展：为 group 添加自定义属性用于动画
        ; (group as any).flyLine = line
    return group
} 