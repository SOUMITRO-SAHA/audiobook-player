import { create } from "zustand";

type TrackPlayerStoreProps = {
  isSetup: boolean;
  isTrackPlayerRegistered: boolean;
  setIsSetup: (value: boolean) => void;
  setRegisterTrackPlayer: (value: boolean) => void;
};

export const useTrackPlayerStore = create<TrackPlayerStoreProps>((set) => ({
  isSetup: false,
  isTrackPlayerRegistered: false,
  setIsSetup: (value) => set({ isSetup: value }),
  setRegisterTrackPlayer: (value) => set({ isTrackPlayerRegistered: value }),
}));
