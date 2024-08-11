import * as React from "react";
import { Audio } from "expo-av";
import { Track, useMusicStore } from "@/store/playerStore";

export const useMusicPlayer = () => {
  const {
    currentTrack,
    currentPlaylistIndex,
    tracks,
    setCurrentTrack,
    setCurrentPlaylistIndex,
  } = useMusicStore();

  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);

  const loadTrack = async (track: Track) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound, status } = await Audio.Sound.createAsync(
      { uri: track.uri },
      { shouldPlay: true }
    );

    setSound(newSound);

    // setPosition(status.positionMillis || 0);
    // setDuration(status.durationMillis || 0);
    // setIsPlaying(status.isPlaying || false);
  };

  const playPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (currentPlaylistIndex !== null && tracks.length > 0) {
      const nextIndex = (currentPlaylistIndex + 1) % tracks.length;
      setCurrentPlaylistIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (currentPlaylistIndex !== null && tracks.length > 0) {
      const prevIndex =
        currentPlaylistIndex === 0
          ? tracks.length - 1
          : currentPlaylistIndex - 1;
      setCurrentPlaylistIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMillis);
      setPosition(positionMillis);
    }
  };

  // Watch for changes in the current track and load it
  React.useEffect(() => {
    if (currentTrack) {
      loadTrack(currentTrack);
    }
  }, [currentTrack]);

  // Clean up the sound object when the component unmounts or when the sound changes
  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return {
    isPlaying,
    currentTrack,
    position,
    duration,
    playPause,
    playNext,
    playPrevious,
    seekTo,
  };
};
