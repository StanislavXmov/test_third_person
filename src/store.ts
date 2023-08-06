import { AnimationMixer, Object3D, Event, AnimationAction } from "three";
import { create } from "zustand";

export const useStore = create(() => ({
  groundObjects: {} as Record<number, Object3D<Event>>,
  actions: {} as Record<string, AnimationAction>,
  mixer: new AnimationMixer(new Object3D()),
}));