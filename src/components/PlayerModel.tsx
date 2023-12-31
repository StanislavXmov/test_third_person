import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Bone, Group,  MeshStandardMaterial, SkinnedMesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useStore } from '../store';

interface SceneModel extends GLTF {
  nodes: {
    mixamorigHips: Bone;
    Cube: SkinnedMesh;
  }
  materials: {
    'Material.004': MeshStandardMaterial;
  }
}

export const PlayerModel = () => {
  const ref = useRef<Group>(null);
  const model = useGLTF('/idle.glb') as SceneModel;
  const walkAnimation = useGLTF('/walking.glb').animations;
  const jumpAnimation = useGLTF('/jumping.glb').animations;
  const runningAnimation = useGLTF('/running.glb').animations;
  const idleAnimation = model.animations;

  const { actions, mixer } = useStore((state) => state);

  useEffect(() => {
    if (ref.current) {
      actions['idle'] = mixer.clipAction(idleAnimation[0], ref.current);
      actions['walk'] = mixer.clipAction(walkAnimation[0], ref.current);
      actions['jump'] = mixer.clipAction(jumpAnimation[0], ref.current);
      actions['run'] = mixer.clipAction(runningAnimation[0], ref.current);
      actions['idle'].play();
    }
  }, [actions, mixer, idleAnimation]);

  return (
    <group ref={ref} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={model.nodes.mixamorigHips} />
          <skinnedMesh 
            castShadow 
            name="Cube" 
            frustumCulled={false} 
            geometry={model.nodes.Cube.geometry} 
            material={model.materials['Material.004']} 
            skeleton={model.nodes.Cube.skeleton} 
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload([
  '/idle.glb',
  '/walking.glb',
  '/jumping.glb',
  '/running.glb',
]);