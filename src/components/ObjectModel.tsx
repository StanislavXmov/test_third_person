import { useTrimesh } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useStore } from '../store';

interface ObjectModel extends GLTF {
  nodes: {
    collider: Mesh & {
      geometry: BufferGeometry & { index: ArrayLike<number> }
    },
    workplace: Group,
  },
  // materials: {
  //   'Material.002': MeshStandardMaterial;
  // }
  materials: {
    'Material.001': MeshStandardMaterial;
  }
}

export const ObjectModel = ({ position }: {position: [number, number, number]}) => {
  const groundObjects = useStore((state) => state.groundObjects);
  const {
    nodes: {
      collider: { geometry },
      workplace,
    },
    materials: {"Material.001": material}
  } = useGLTF('public/workplace.glb') as ObjectModel;

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
      position,
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
      <primitive position={position} object={workplace} />
      <mesh
        ref={ref}
        geometry={geometry}
        material={material}
        visible={false}
      />
    </group>
  )
}
