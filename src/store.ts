import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { AnimationMixer, Object3D, Event, AnimationAction } from "three";
import { create } from "zustand";

export const useStore = create(() => ({
  groundObjects: {} as Record<number, Object3D<Event>>,
  actions: {} as Record<string, AnimationAction>,
  mixer: new AnimationMixer(new Object3D()),
}));

type DirectionStore = {
  direction: IJoystickUpdateEvent["direction"];
  setDirection: (dir: IJoystickUpdateEvent["direction"]) => void;
}

type RotationStore = {
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (x: number) => void;
}

export const useDirection = create<DirectionStore>((set) => ({
  direction: null,
  setDirection: (dir) => set({direction: dir}),
}));

export const useRotation = create<RotationStore>((set) => ({
  x: 0,
  y: 0,
  setX: (x) => set({x}),
  setY: (y) => set({y}),
}));