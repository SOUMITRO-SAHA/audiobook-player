import { create } from "zustand";

type AppStoreProps = {
  isLoading: boolean;
  setLoading: () => void;
  resetLoading: () => void;
  reLoadApplication: () => void;
  reLoadAccount: () => void;
  reLoadPlayList: () => void;

  // For Library
  isLibraryLoading: boolean;
  setLibraryLoading: () => void;
  resetLibraryLoading: () => void;
  reLoadLibrary: () => void;
};

export const useAppStore = create<AppStoreProps>((set) => ({
  isLoading: false,
  isLibraryLoading: false,
  setLoading: () => set({ isLoading: true }),
  resetLoading: () => set({ isLoading: false }),
  reLoadApplication: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
  reLoadAccount: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
  reLoadPlayList: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
  setLibraryLoading: () => set({ isLibraryLoading: true }),
  resetLibraryLoading: () => set({ isLibraryLoading: false }),
  reLoadLibrary: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
}));
