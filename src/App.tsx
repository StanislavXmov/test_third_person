import { Canvas } from '@react-three/fiber';
import {
  // OrbitControls,
  Stats,
  Environment,
} from '@react-three/drei';
import { Physics } from '@react-three/cannon'
// import { Color } from 'three';
import { useDevice } from './hooks/useDevice';
import { Level } from './components/Level';

import styles from './App.module.scss';
import { MobileControls } from './components/MobileControls';

function App() {
  const isMobile = useDevice();
  
  return (
    <div className={styles.app}>
      {isMobile && <MobileControls />}
      <Canvas 
        shadows 
        onPointerDown={(e) => {!isMobile && (e.target as HTMLCanvasElement).requestPointerLock()}}
      >
        <Environment
          files="/test.hdr"
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
