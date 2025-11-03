// 经纬度转球面坐标工具函数
// import * as THREE from 'three'

/**
 * 经纬度坐标转球面坐标
 */
export function lon2xyz(R: number, longitude: number, latitude: number) {
    let lon = longitude * Math.PI / 180; // 转弧度值
    let lat = latitude * Math.PI / 180; // 转弧度值
    lon = -lon; // three.js坐标系z轴对应经度-90度

    // 经纬度坐标转球面坐标计算公式
    const x = R * Math.cos(lat) * Math.cos(lon);
    const y = R * Math.sin(lat);
    const z = R * Math.cos(lat) * Math.sin(lon);
    return { x, y, z };
} 