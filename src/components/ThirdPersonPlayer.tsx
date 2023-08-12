import { Suspense, useMemo, useRef } from 'react';
import { Vector3, Euler, Quaternion, Matrix4, Mesh, Group } from 'three';
import { useCompoundBody, useContactMaterial } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Vec3 } from 'cannon-es';
import { useDirection, useRotation, useStore } from '../store';
import useKeyboard from '../hooks/useKeyboard';
import useFollowCam from '../hooks/useFollowCam';
import { PlayerModel } from './PlayerModel';
import { Direction } from './MobileControls';
import { useDevice } from '../hooks/useDevice';

enum ActiveAction { idle, walking, jumping, running };

export const ThirdPersonPlayer = ({ position }: {position: [number, number, number]}) => {
  const isMobile = useDevice();
  const { pivot, onStickMove } = useFollowCam();
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const group = useRef(new Group);
  const velocity = useMemo(() => new Vector3(), []);
  const inputVelocity = useMemo(() => new Vector3(), []);
  const euler = useMemo(() => new Euler(), []);
  const quat = useMemo(() => new Quaternion(), []);
  const targetQuaternion = useMemo(() => new Quaternion(), []);
  const worldPosition = useMemo(() => new Vector3(), []);
  const raycasterOffset = useMemo(() => new Vector3(), []);
  const contactNormal = useMemo(() => new Vec3(0, 0, 0), []);
  const down = useMemo(() => new Vec3(0, -1, 0), []);
  const rotationMatrix = useMemo(() => new Matrix4(), []);
  const prevActiveAction = useRef(ActiveAction.idle);
  const keyboard = useKeyboard();

  const { groundObjects, actions, mixer } = useStore((state) => state);

  const direction = useDirection(state => state.direction);
  const x = useRotation(state => state.x);

  useContactMaterial('ground', 'slippery', {
    friction: 0,
    restitution: 0.01,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  });

  const [ref, body] = useCompoundBody(
    () => ({
      mass: 1,
      shapes: [
        { args: [0.25], position: [0, 0.25, 0], type: 'Sphere' },
        { args: [0.25], position: [0, 0.75, 0], type: 'Sphere' },
        { args: [0.25], position: [0, 1.25, 0], type: 'Sphere' }
      ],
      onCollide: (e) => {
        if (e.contact.bi.id !== e.body.id) {
          contactNormal.set(e.contact.ni[0], e.contact.ni[1], e.contact.ni[2])
        }
        if (contactNormal.dot(down) > 0.5) {
          if (inJumpAction.current) {
            inJumpAction.current = false
            actions['jump'].fadeOut(0.1)
            actions['idle'].reset().fadeIn(0.1).play()
          }
        }
      },
      material: 'slippery',
      linearDamping: 0,
      position: position
    }),
    useRef(new Mesh)
  );

  useFrame(({ raycaster }, delta) => {
    if (!group.current) {
      return;
    }
    if (!ref.current) {
      return;
    }
    let activeAction = ActiveAction.idle;

    body.angularFactor.set(0, 0, 0);

    ref.current.getWorldPosition(worldPosition);

    playerGrounded.current = false;
    raycasterOffset.copy(worldPosition);
    raycasterOffset.y += 0.01;
    raycaster.set(raycasterOffset, new Vector3(down.x, down.y, down.z));
    raycaster.intersectObjects(Object.values(groundObjects), false).forEach((i) => {
      if (i.distance < 0.021) {
        playerGrounded.current = true;
      }
    })
    if (!playerGrounded.current) {
      body.linearDamping.set(0);
    } else {
      body.linearDamping.set(0.9999999);
    }
    
    const distance = worldPosition.distanceTo(group.current.position);

    rotationMatrix.lookAt(worldPosition, group.current.position, group.current.up);
    targetQuaternion.setFromRotationMatrix(rotationMatrix);
    if (distance > 0.0001 && !group.current.quaternion.equals(targetQuaternion)) {
      targetQuaternion.z = 0;
      targetQuaternion.x = 0;
      targetQuaternion.normalize();
      group.current.quaternion.rotateTowards(targetQuaternion, delta * 20);
    }
    if (document.pointerLockElement || isMobile) {
      inputVelocity.set(0, 0, 0);
      if (playerGrounded.current) {
        // if (keyboard['KeyW'] || direction === Direction.FORWARD)
        if (keyboard['KeyW'] && keyboard['ShiftLeft'] ) {
          activeAction = ActiveAction.running;
          inputVelocity.z = -100 * delta;
        } else if (keyboard['KeyW'] || direction === Direction.FORWARD) {
          activeAction = ActiveAction.walking;
          inputVelocity.z = -20 * delta;
        }
        if (keyboard['KeyS'] && keyboard['ShiftLeft'] ) {
          activeAction = ActiveAction.running;
          inputVelocity.z = 100 * delta;
        } else if (keyboard['KeyS'] || direction === Direction.BACKWARD) {
          activeAction = ActiveAction.walking;
          inputVelocity.z = 20 * delta;
        }
        if (keyboard['KeyA'] && keyboard['ShiftLeft'] ) {
          activeAction = ActiveAction.running;
          inputVelocity.x = -100 * delta;
        } else if (keyboard['KeyA'] || direction === Direction.LEFT) {
          activeAction = ActiveAction.walking;
          inputVelocity.x = -20 * delta;
        }
        if (keyboard['KeyD'] && keyboard['ShiftLeft'] ) {
          activeAction = ActiveAction.running;
          inputVelocity.x = 100 * delta;
        } else if (keyboard['KeyD'] || direction === Direction.RIGHT) {
          activeAction = ActiveAction.walking;
          inputVelocity.x = 20 * delta;
        }
      }
      // test run
      // inputVelocity.setLength(0.5);

      if (activeAction !== prevActiveAction.current) {
        if (prevActiveAction.current !== ActiveAction.walking && activeAction === ActiveAction.walking) {
          actions['idle'].fadeOut(0.1);
          actions['run'].fadeOut(0.1);
          actions['walk'].reset().fadeIn(0.1).play();
        }
        if (prevActiveAction.current !== ActiveAction.idle && activeAction === ActiveAction.idle) {
          actions['walk'].fadeOut(0.1);
          actions['run'].fadeOut(0.1);
          actions['idle'].reset().fadeIn(0.1).play();
        }
        if (prevActiveAction.current !== ActiveAction.running && activeAction === ActiveAction.running) {
          actions['idle'].fadeOut(0.1);
          actions['walk'].fadeOut(0.1);
          actions['run'].reset().fadeIn(0.1).play();
        }
        prevActiveAction.current = activeAction;
      }

      if (keyboard['Space']) {
        if (playerGrounded.current && !inJumpAction.current) {
          activeAction = ActiveAction.jumping;
          inJumpAction.current = true;
          actions['walk'].fadeOut(0.1);
          actions['idle'].fadeOut(0.1);
          actions['jump'].reset().fadeIn(0.1).play();
          inputVelocity.y = 6;
        }
      }

      euler.y = pivot.rotation.y;
      euler.order = 'YZX';
      quat.setFromEuler(euler);
      inputVelocity.applyQuaternion(quat);
      velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);

      body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0]);
    }
    // if (activeAction === ActiveAction.walking) {
    //   mixer.update(delta * distance * 22.5);
    // } else {
    //   mixer.update(delta);
    // }
    mixer.update(delta);
    group.current.position.lerp(worldPosition, 0.3);
    if (isMobile) {
      onStickMove(x, 0);
    }
    pivot.position.lerp(worldPosition, 0.1);

    if (group.current.position.y < - 4) {
      console.log('DROP');
      group.current.position.lerp(new Vector3(position[0], position[1], position[2]), 0.3);
      body.position.set(position[0], position[1], position[2]);
    }
    
  });

  return (
    <>
      <group ref={group} position={position}>
        <Suspense fallback={null}>
          <PlayerModel />
        </Suspense>
      </group>
    </>
  );
};