import create from "zustand";

export type Track = {
  id: string;
  uri: string;
  title: string;
  artist: string;
};

type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

type MusicPlayerState = {
  tracks: Track[];
  playlists: Playlist[];
  currentTrack: Track | null;
  currentPlaylistIndex: number | null;
  setTracks: (tracks: Track[]) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  setCurrentTrack: (track: Track) => void;
  setCurrentPlaylistIndex: (index: number) => void;
};

export const useMusicStore = create<MusicPlayerState>((set) => ({
  tracks: [],
  playlists: [],
  currentTrack: null,
  currentPlaylistIndex: null,
  setTracks: (tracks) => set({ tracks }),
  addTrackToPlaylist: (playlistId, track) =>
    set((state) => {
      const playlists = state.playlists.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
          };
        }
        return playlist;
      });
      return { playlists };
    }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setCurrentPlaylistIndex: (index) => set({ currentPlaylistIndex: index }),
}));
