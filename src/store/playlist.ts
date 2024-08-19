import { Book } from "@/types/book";
import { Track } from "react-native-track-player";
import { create } from "zustand";

type PlaylistStoreProps = {
  playlistName: string;
  coverImage: string;
  playbackSpeed: number;
  playlist: Track[];
  allBooksInfo: Book[];
  currentlySelectedBooksInfo: number;

  setCurrentlySelectedBooksInfo: (index: number) => void;

  setAllBooksInfo: (bookInfo: Book[]) => void;
  resetAllBooksInfo: () => void;

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
  allBooksInfo: [],
  currentlySelectedBooksInfo: 0,

  setCurrentlySelectedBooksInfo: (value: number) =>
    set({ currentlySelectedBooksInfo: value }),

  setAllBooksInfo: (bookInfo: Book[]) =>
    set({
      allBooksInfo: bookInfo,
    }),

  resetAllBooksInfo: () =>
    set({
      allBooksInfo: [],
    }),

  setPlaylist: (tracks: Track[]) => set({ playlist: tracks }),
  resetPlaylist: () => set({ playlist: [] }),

  setPlaybackSpeed: (value: number) => set({ playbackSpeed: value }),

  setPlaylistName: (name: string) => set({ playlistName: name }),
  resetPlaylistName: () => set({ playlistName: "" }),

  setCoverImage: (image: string) => set({ coverImage: image }),
  resetCoverImage: () => set({ coverImage: "" }),
}));
