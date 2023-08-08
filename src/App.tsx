import { Canvas } from '@react-three/fiber';
import {
  // OrbitControls,
  Stats,
  Environment
} from '@react-three/drei';
import { Physics } from '@react-three/cannon'
// import { Color } from 'three';
import { Level } from './components/Level';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <Canvas 
        shadows 
        onPointerDown={(e) => (e.target as HTMLCanvasElement).requestPointerLock()}
      >
        <Environment
          files="public/test.hdr"
          background
          blur={0.5}
        />
        <directionalLight
          intensity={1}
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
        {/* TEST LIGHT */}
        {/* <ambientLight color={new Color('#d1eaff')} intensity={1} /> */}
        <Physics>
          {/* LEVEL */}
          <Level />
        </Physics>
        {/* TEST */}
        {/* <OrbitControls /> */}
        <Stats />
      </Canvas>
    </div>
  );
}

export default App;
