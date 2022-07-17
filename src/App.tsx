import "./App.css";
import { DirectionalLight, ThirdPersonCamera, types } from "lingo3d-react";
import { keyboard } from "lingo3d-react";
import { Dummy } from "lingo3d-react";
import {
  Joystick,
  Model,
  usePreload,
  World,
  useWindowSize,
} from "lingo3d-react";
import { useEffect, useRef } from "react";

// Game world component
// 场景组件
const Game = () => {
  // when window width is smaller than window height, user is using mobile device in portrait mode
  // set camera fov to 120 if this happens
  // 当视窗的宽小于高，意味着用户使用的是移动设备，并且是竖屏模式
  // 此时，将相机的视野设置为120
  const windowSize = useWindowSize();
  const fov = windowSize.width > windowSize.height ? 90 : 120;

  // ref to fox model
  // 小狐狸模型的ref
  const foxRef = useRef<types.Dummy>(null);

  // listen to keyboard events, enable WASD controls
  // 监听键盘事件，启用WASD控制
  useEffect(() => {
    keyboard.onKeyPress = (_, keys) => {
      const fox = foxRef.current;
      if (!fox) return;

      // stride forward and stride right determine the direction the player is moving towards
      // 向前和向右的步伐，用于确定玩家的移动方向

      if (keys.has("w")) fox.strideForward = -5;
      else if (keys.has("s")) fox.strideForward = 5;
      else fox.strideForward = 0;

      if (keys.has("a")) fox.strideRight = 5;
      else if (keys.has("d")) fox.strideRight = -5;
      else fox.strideRight = 0;
    };
  }, []);

  return (
    // set both skybox and environment lighting to HDR image
    // 将天空盒和环境光照设置为HDR贴图
    <World defaultLight="env.hdr" skybox="env.hdr">
      {/* light that casts shadows */}
      {/* 投射阴影的灯光 */}
      <DirectionalLight y={1000} z={1000} x={1000} />

      {/* map model */}
      {/* 地图模型 */}
      <Model src="Grassland.glb" scale={300} physics="map" />

      {/* fox model, and the camera that follows it */}
      {/* 狐狸模型，和跟随它的相机 */}
      <ThirdPersonCamera
        active
        mouseControl="drag"
        lockTargetRotation="dynamic-lock"
        fov={fov}
        enableDamping
      >
        <Dummy
          ref={foxRef}
          src="Fox.fbx"
          animations={{ idle: "Idle.fbx", running: "Walking.fbx" }}
          strideMode="free"
          strideMove
          physics="character"
          metalnessFactor={-5}
        />
      </ThirdPersonCamera>

      {/* joystick */}
      {/* 摇杆 */}
      <Joystick
        onMove={(e) => {
          const fox = foxRef.current;
          if (!fox) return;

          fox.strideForward = -e.y * 5;
          fox.strideRight = -e.x * 5;
        }}
        onMoveEnd={() => {
          const fox = foxRef.current;
          if (!fox) return;

          fox.strideForward = 0;
          fox.strideRight = 0;
        }}
      />
    </World>
  );
};

// App component renders a preloader for static assets
// App组件渲染静态资源的预加载器
const App = () => {
  const progress = usePreload(
    ["Fox.fbx", "Grassland.glb", "Idle.fbx", "env.hdr", "Walking.fbx"],
    "5.6mb"
  );

  if (progress < 100)
    return <div className="loading">loading {Math.round(progress)}%</div>;

  return <Game />;
};

export default App;
