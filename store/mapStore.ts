import { create } from "zustand";

type MapState = {
  selectedPosition: [number, number];

  setSelectedPosition: (
    position: [number, number]
  ) => void;
};

export const useMapStore =
  create<MapState>((set) => ({
    selectedPosition: [20, 0],

    setSelectedPosition: (position) =>
      set({
        selectedPosition: position,
      }),
  }));