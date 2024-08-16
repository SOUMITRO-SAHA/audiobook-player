import { Asset } from "expo-media-library";
import { Track } from "react-native-track-player";
import { create } from "zustand";

type PlaylistStoreProps = {
  playlistName: string;
  coverImage: string;
  playbackSpeed: number;
  playlist: Track[];

  setPlaylist: (tracks: Track[]) => void;
  resetPlaylist: () => void;

  setPlaybackSpeed: (value: number) => void;

  setPlaylistName: (name: string) => void;
  resetPlaylistName: () => void;

  setCoverImage: (image: string) => void;
  resetCoverImage: () => void;
};

export const usePlaylistStore = create<PlaylistStoreProps>((set) => ({
  playlistName: "",
  coverImage: "",
  playbackSpeed: 1,
  playlist: [],

  setPlaylist: (tracks: Track[]) => set({ playlist: tracks }),
  resetPlaylist: () => set({ playlist: [] }),

  setPlaybackSpeed: (value: number) => set({ playbackSpeed: value }),

  setPlaylistName: (name: string) => set({ playlistName: name }),
  resetPlaylistName: () => set({ playlistName: "" }),

  setCoverImage: (image: string) => set({ coverImage: image }),
  resetCoverImage: () => set({ coverImage: "" }),
}));
