import { useRef, useEffect } from 'react';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';
import { useStore } from '../store';
import { useGLTF } from '@react-three/drei';

export const Floor = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground' }), useRef(new Mesh));
  const groundObjects = useStore((state) => state.groundObjects);
  const ground = useGLTF('public/floor.glb');

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const id = ref.current.id;
    groundObjects[id] = ref.current;
    return () => {
      delete groundObjects[id];
    }
  }, [groundObjects, ref]);

  return (
    <group>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <primitive object={ground.scene.clone()} position={[0, -0.05, 0]}/>
      <primitive object={ground.scene.clone()} position={[10, -0.05, 0]}/>
      <primitive object={ground.scene.clone()} position={[0, -0.05, -10]}/>
      <primitive object={ground.scene.clone()} position={[10, -0.05, -10]}/>
    </group>
  )
}