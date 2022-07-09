import "./App.css"
import { ThirdPersonCamera } from "lingo3d-react"
import { keyboard } from "lingo3d-react"
import { Dummy } from "lingo3d-react"
import {
    Joystick,
    Model,
    usePreload,
    World,
    useWindowSize
} from "lingo3d-react"
import { useEffect, useState } from "react"

// Game world component
// 场景组件
const Game = () => {
    // when window width is smaller than window height, user is using mobile device in portrait mode
    // set camera fov to 120 if this happens
    // 当视窗的宽小于高，意味着用户使用的是移动设备，并且是竖屏模式
    // 此时，将相机的视野设置为120
    const windowSize = useWindowSize()
    const fov = windowSize.width > windowSize.height ? 90 : 120

    // stride forward and stride right determine the direction the player is moving towards
    // 向前和向右的步伐，用于确定玩家的移动方向
    const [strideForward, setStrideForward] = useState(0)
    const [strideRight, setStrideRight] = useState(0)

    // listen to keyboard events, enable WASD controls
    // 监听键盘事件，启用WASD控制
    useEffect(() => {
        keyboard.onKeyPress = (_, keys) => {
            if (keys.has("w")) setStrideForward(-5)
            else if (keys.has("s")) setStrideForward(5)
            else setStrideForward(0)

            if (keys.has("a")) setStrideRight(5)
            else if (keys.has("d")) setStrideRight(-5)
            else setStrideRight(0)
        }
    }, [])

    return (
        // set both skybox and environment lighting to HDR image
        // 将天空盒和环境光照设置为HDR贴图
        <World defaultLight="env.hdr" skybox="env.hdr">
            {/* map model, roughness amd metalness adjusted for better color contrast */}
            {/* 地图模型, 调整粗糙度和金属度以便实现更好的色彩对比度 */}
            <Model
                src="Grassland.glb"
                scale={300}
                physics="map"
                roughnessFactor={0.5}
                metalnessFactor={1}
            />

            {/* fox model, and the camera that follows it */}
            {/* 狐狸模型，和跟随它的相机 */}
            <ThirdPersonCamera active mouseControl="drag" fov={fov} enableDamping>
                <Dummy
                    src="Fox.fbx"
                    animations={{ idle: "Idle.fbx", running: "Walking.fbx" }}
                    strideMode="free"
                    strideMove
                    strideForward={strideForward}
                    strideRight={strideRight}
                    physics="character"
                    metalnessFactor={-1}
                />
            </ThirdPersonCamera>

            {/* joystick */}
            {/* 摇杆 */}
            <Joystick
                onMove={(e) => {
                    setStrideForward(-e.y * 5)
                    setStrideRight(-e.x * 5)
                }}
                onMoveEnd={() => {
                    setStrideForward(0)
                    setStrideRight(0)
                }}
            />
        </World>
    )
}

// App component renders a preloader for static assets
// App组件渲染静态资源的预加载器
const App = () => {
    const progress = usePreload(
        [
            "Fox.fbx",
            "Grassland.glb",
            "Idle.fbx",
            "env.hdr",
            "Walking.fbx"
        ],
        "5.6mb"
    )

    if (progress < 100)
        return <div className="loading">loading {Math.round(progress)}%</div>

    return <Game />
}

export default App
