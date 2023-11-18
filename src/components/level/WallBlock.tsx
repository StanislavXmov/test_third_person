import { useRef, useEffect } from 'react';
import { useBox, Triplet } from '@react-three/cannon';
import { Mesh } from 'three';
import { useStore } from '../../store';
import { Vector3 } from '@react-three/fiber';

export const WallBlock = ({position} : {position: Vector3}) => {
  const [ref] = useBox(() => ({ args: [30, 10, 0.5], position: position  as Triplet }), useRef(new Mesh));
  const groundObjects = useStore((state) => state.groundObjects);

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
      <mesh ref={ref} position={position} receiveShadow>
        <boxGeometry args={[30, 10, 0.5]} />
        <meshStandardMaterial transparent opacity={1} visible={false} />
      </mesh>
    </group>
  )
}
