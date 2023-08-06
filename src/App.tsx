import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { Physics } from '@react-three/cannon'
import { Color } from 'three';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <Canvas 
        shadows 
        onPointerDown={(e) => (e.target as HTMLCanvasElement).requestPointerLock()}
      >
        <directionalLight
          intensity={2}
          castShadow={true}
          shadow-bias={-0.00015}
          shadow-radius={4}
          shadow-blur={10}
          shadow-mapSize={[2048, 2048]}
          position={[85.0, 80.0, 70.0]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <ambientLight color={new Color('#d1eaff')} intensity={1} />
        <Physics>
          {/* LEVEL */}
        </Physics>
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}

export default App;
