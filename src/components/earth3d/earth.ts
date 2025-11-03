import * as THREE from 'three'
import { countryLine } from './line'
import { createEarthSprite } from './sprite'
import config from './config'
import earth from './resources/static/earth.png'

/**
 * 创建地球整体 Group，包括球体、国家边界、光圈等
 */
export async function createEarth(
    themeColor: number | undefined = undefined
): Promise<THREE.Group> {
    const R = config.R
    const earth = new THREE.Group()
    const color = themeColor || 0x009999
    earth.add(createSphereMesh(R))
    earth.add(await countryLine(R * 1.001, color)) // 传递颜色参数
    earth.add(createEarthSprite(R, color)) // 传递颜色参数给地球光圈
    return earth
}

/**
 * 创建地球球体 Mesh
 */
function createSphereMesh(r: number): THREE.Mesh {
    // 贴图路径适配 public 目录
    const texture = new THREE.TextureLoader().load(earth)
    const geometry = new THREE.SphereGeometry(r, 40, 40)
    const material = new THREE.MeshLambertMaterial({
        map: texture,
    })
    return new THREE.Mesh(geometry, material)
} 