import { Asset } from "expo-media-library";
import { create } from "zustand";

type PlaylistStoreProps = {
  playlistName: string;
  coverImage: string;
  track: Asset | null;
  tracks: Asset[];
};

export const usePlaylistStore = create<PlaylistStoreProps>((set) => ({
  playlistName: "",
  coverImage: "",
  track: null,
  tracks: [],
  setPlaylistName: (name: string) => {
    set((state) => ({ ...state, playlistName: name }));
  },
  resetPlaylistName: () => {
    set((state) => ({ ...state, playlistName: "" }));
  },
  setCoverImage: (image: string) => {
    set((state) => ({ ...state, coverImage: image }));
  },
  resetCoverImage: () => {
    set((state) => ({ ...state, coverImage: "" }));
  },
  addTrack: (track: Asset) => {
    set((state) => ({ ...state, track: track }));
  },
  resetTrack: () => {
    set((state) => ({ ...state, track: null }));
  },
}));
