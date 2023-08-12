import { IJoystickUpdateEvent, Joystick } from "react-joystick-component/build/lib/Joystick";
import { useDirection, useRotation } from "../store";

import styles from '../App.module.scss';
import { JoystickShape } from "react-joystick-component";

export enum Direction {
  FORWARD = 'FORWARD',
  RIGHT = 'RIGHT',
  BACKWARD = 'BACKWARD',
  LEFT = 'LEFT',
}

export const MobileControls = () => {
  const set = useDirection(state => state.setDirection);
  const setX = useRotation(state => state.setX);

  const handleLeftStickerMove = (e: IJoystickUpdateEvent) => {
    set(e.direction);
  }
  const handleLeftStickerStop = (e: IJoystickUpdateEvent) => {
    set(e.direction);
  }
  const handleRightStickerMove = (e: IJoystickUpdateEvent) => {
    if (e.distance && e.direction === Direction.LEFT) {
      setX(e.distance * -1 / 10);
    }
    if (e.distance && e.direction === Direction.RIGHT) {
      setX(e.distance / 10);
    }
  }
  const handleRightStickerStop = (e: IJoystickUpdateEvent) => {
    setX(0);
  }
  return (
    <div className={styles.joystickWrapper}>
      <Joystick 
        size={120}
        stickSize={60}
        sticky={false} 
        baseImage='public/wasd.svg'
        stickImage='public/stick.svg'
        move={handleLeftStickerMove} 
        stop={handleLeftStickerStop}
      />
      <Joystick 
        size={120}
        stickSize={60}
        sticky={false} 
        baseImage='public/ad.svg'
        stickImage='public/stick.svg' 
        move={handleRightStickerMove} 
        stop={handleRightStickerStop}
        controlPlaneShape={JoystickShape.AxisX}
      />
    </div>
  )
}
