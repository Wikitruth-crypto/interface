import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createEarth } from './earth'
import { createFlyGroup } from './flyGroup'
// import config from './config'
import { cityData } from './city'

interface Earth3DCoreOptions {
    // 是否禁止缩放
    isDisableZoom?: boolean
    // 是否禁止旋转
    isDisableRotate?: boolean
    // 是否禁止鼠标控制
    isDisableMouseControl?: boolean
    // 主题色
    themeColor?: string
    // 是否开启光圈等级
    isWaveLevelOpen?: boolean
}

export const levelColor = {
    low: 0xFFFF00,    // 低等级 - 黄色
    middle: 0xFFA500, // 中等级 - 橙色
    high: 0xFF0000   // 高等级 - 红色
}

/**
 * 获取颜色值，支持主题色、特定颜色和等级颜色
 */
function getColorValue(color: string | number): number {
    if (typeof color === 'string') {
        // 如果是十六进制字符串，转换为数字
        if (color.startsWith('#')) {
            return parseInt(color.slice(1), 16)
        } else if (color.startsWith('0x')) {
            return Number(color);
        }
        // 如果是颜色名称，返回对应的十六进制值
        const colorMap: { [key: string]: number } = {
            'green': 0x22c55e,
            'blue': 0x1991fc,
            'red': 0xf32121,
            'yellow': 0xffff00,
            'cyan': 0x00ffff,
            'purple': 0x9333ea,
            'orange': 0xffb11b,
            'white': 0xffffff
        }
        return colorMap[color] || 0x22c55e
    }
    return color
}

/**
 * 获取随机等级颜色
 */
function getRandomLevelColor(): number {
    const levels = Object.values(levelColor)
    return levels[Math.floor(Math.random() * levels.length)]
}

/**
 * Earth3DCore 主类，负责地球可视化的初始化、动画与销毁
 */
export class Earth3DCore {
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private controls: OrbitControls
    private earth: THREE.Group | undefined
    private flyGroup!: ReturnType<typeof createFlyGroup> // 使用 ! 断言，因为会在 initFlyGroup 中初始化
    private animationId: number | null = null
    private container: HTMLElement
    private width: number
    private height: number
    private options: Earth3DCoreOptions
    private themeColor: number

    constructor(container: HTMLElement, options: Earth3DCoreOptions = {}) {
        this.container = container
        this.width = container.clientWidth
        this.height = container.clientHeight
        this.options = options
        
        // 初始化颜色系统
        this.themeColor = getColorValue(options.themeColor || 0x22ffcc)
        
        // 创建场景
        this.scene = new THREE.Scene()
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 2000)
        this.camera.position.set(0, 0, 500)
        this.camera.lookAt(0, 0, 0)
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0x000000, 0)
        this.container.appendChild(this.renderer.domElement)
        // 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        
        // 应用控制参数
        if (options.isDisableZoom) {
            this.controls.enableZoom = false
        }
        if (options.isDisableRotate) {
            this.controls.enableRotate = false
        }
        if (options.isDisableMouseControl) {
            this.controls.enabled = false // 完全禁用鼠标控制
        }
        
        // 光源
        this.addLights()
        // 地球本体
        this.initEarth() // 异步初始化地球
        // 飞线、点、光圈、锥体等
        this.initFlyGroup()
        // 动画循环
        this.animate = this.animate.bind(this)
        this.animate()
        // 窗口自适应
        window.addEventListener('resize', this.handleResize)
    }

    private async initEarth() {
        this.earth = await createEarth(this.themeColor) // 使用 lineColor 作为国家边界线条颜色
        this.scene.add(this.earth)
        // 关键：把 flyGroup.group 加到 earth 下
        this.earth.add(this.flyGroup.group)
    }

    private initFlyGroup() {
        // 根据是否开启光圈等级来决定颜色
        const baseColor = this.options.isWaveLevelOpen ? 
            getRandomLevelColor() : this.themeColor

        const flyData = {
            color: baseColor,
            start: cityData.start,
            endArr: cityData.endArr.map(item => ({
                ...item,
                size: Math.random() * 1 + 0.5,
                // 如果开启光圈等级，为每个点分配随机等级颜色
                levelColor: this.options.isWaveLevelOpen ? getRandomLevelColor() : baseColor
            }))
        }

        this.flyGroup = createFlyGroup(flyData)
    }

    /**
     * 添加光源
     */
    private addLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.7)
        this.scene.add(ambient)
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
        dirLight.position.set(400, 200, 300)
        this.scene.add(dirLight)
        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6)
        dirLight2.position.set(-400, -200, -300)
        this.scene.add(dirLight2)
    }

    /**
     * 动画主循环
     */
    private animate() {
        this.animationId = requestAnimationFrame(this.animate)
        // 地球自转
        if (this.earth) {
            this.earth.rotation.y += 0.001
        }
        // 波动光圈动画
        this.flyGroup.waveArr.forEach((mesh: any) => {
            mesh._s += 0.007
            mesh.scale.set(mesh._s, mesh._s, mesh._s)
            if (mesh._s <= 1.5) {
                mesh.material.opacity = (mesh._s - 1) * 2
            } else if (mesh._s > 1.5 && mesh._s <= 2) {
                mesh.material.opacity = 1 - (mesh._s - 1.5) * 2
            } else {
                mesh._s = 1.0
            }
        })
        // 渲染
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * 窗口自适应
     */
    private handleResize = () => {
        this.width = this.container.clientWidth
        this.height = this.container.clientHeight
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.width, this.height)
    }

    /**
     * 销毁与清理
     */
    public dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId)
        window.removeEventListener('resize', this.handleResize)
        this.renderer.dispose()
        if (this.container && this.renderer.domElement.parentNode === this.container) {
            this.container.removeChild(this.renderer.domElement)
        }
    }
} 