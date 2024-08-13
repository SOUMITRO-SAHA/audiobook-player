import * as React from "react";
import { Audio } from "expo-av";
import { Track, useMusicStore } from "@/store/playerStore";
import { shallow } from "zustand/shallow";

export const useMusicPlayer = () => {
  const {
    currentTrack,
    currentPlaylistIndex,
    tracks,
    setCurrentTrack,
    setCurrentPlaylistIndex,
    isPlaying,
    playMusic,
    pauseMusic,
  } = useMusicStore(
    (state) => ({
      currentTrack: state.currentTrack,
      currentPlaylistIndex: state.currentPlaylistIndex,
      tracks: state.tracks,
      setCurrentTrack: state.setCurrentTrack,
      setCurrentPlaylistIndex: state.setCurrentPlaylistIndex,
      isPlaying: state.isPlaying,
      playMusic: state.playMusic,
      pauseMusic: state.pauseMusic,
    }),
    shallow
  );

  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [position, setPosition] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);

  const loadTrack = React.useCallback(
    async (track: Track) => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true }
      );

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);
          if (status.isPlaying) {
            playMusic();
          } else {
            pauseMusic();
          }
        }
      });

      setSound(newSound);
    },
    [sound, playMusic, pauseMusic]
  );

  const playPause = React.useCallback(async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        pauseMusic();
      } else {
        await sound.playAsync();
        playMusic();
      }
    }
  }, [sound, isPlaying, playMusic, pauseMusic]);

  const playNext = React.useCallback(() => {
    if (currentPlaylistIndex !== null && tracks.length > 0) {
      const nextIndex = (currentPlaylistIndex + 1) % tracks.length;
      setCurrentPlaylistIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
    }
  }, [currentPlaylistIndex, tracks, setCurrentTrack, setCurrentPlaylistIndex]);

  const playPrevious = React.useCallback(() => {
    if (currentPlaylistIndex !== null && tracks.length > 0) {
      const prevIndex =
        currentPlaylistIndex === 0
          ? tracks.length - 1
          : currentPlaylistIndex - 1;
      setCurrentPlaylistIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
    }
  }, [currentPlaylistIndex, tracks, setCurrentTrack, setCurrentPlaylistIndex]);

  const seekTo = React.useCallback(
    async (positionMillis: number) => {
      if (sound) {
        await sound.setPositionAsync(positionMillis);
        setPosition(positionMillis);
      }
    },
    [sound]
  );

  // Watch for changes in the current track and load it
  React.useEffect(() => {
    if (currentTrack) {
      loadTrack(currentTrack);
    }
  }, [currentTrack, loadTrack]);

  // Clean up the sound object when the component unmounts or when the sound changes
  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync().then(() => sound.unloadAsync());
      }
    };
  }, [sound]);

  return React.useMemo(
    () => ({
      isPlaying,
      currentTrack,
      position,
      duration,
      playPause,
      playNext,
      playPrevious,
      seekTo,
    }),
    [
      isPlaying,
      currentTrack,
      position,
      duration,
      playPause,
      playNext,
      playPrevious,
      seekTo,
    ]
  );
};
