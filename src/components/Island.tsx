import { useTrimesh } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { BufferGeometry, Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useStore } from '../store';

interface IslandModel extends GLTF {
  nodes: {
    collider: Mesh & {
      geometry: BufferGeometry & { index: ArrayLike<number> }
    },
    ground2: Mesh & {
      geometry: BufferGeometry & { index: ArrayLike<number> }
    },
  },
  materials: {
    'Material.001': MeshStandardMaterial;
  }
}

export const Island = ({ position }: {position: [number, number, number]}) => {
  const groundObjects = useStore((state) => state.groundObjects);
  const {
    nodes: {
      collider: { geometry },
      ground2,
    },
    materials: {"Material.001": material}
  } = useGLTF('public/island.glb') as IslandModel;

  const {
    attributes: {
      position: { array: vertices },
    },
    index: { array: indices },
  } = geometry;

  const [ref] = useTrimesh(
    () => ({
      args: [vertices, indices],
      mass: 0,
      position: position,
      material: 'ground'
    }),
    useRef<Mesh>(null),
  );

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
      <mesh
        ref={ref}
        geometry={geometry}
        material={material}
        visible={false}
      />
      <primitive position={position} object={ground2} />
    </group>
  );
}
