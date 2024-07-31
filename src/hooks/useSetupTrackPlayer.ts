import { setUpPlayer } from "@/musicPlayerServices";
import { useEffect, useRef } from "react";
import TrackPlayer, { RepeatMode } from "react-native-track-player";

const setupMusicPlayer = async () => {
  // Getting the Setup from the `musicPlayerServices`
  const isSetUp = await setUpPlayer();

  if (isSetUp) {
    // Default Volume
    await TrackPlayer.setVolume(0.03); // TODO: Update it later
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  }
};

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
  const isInitialized = useRef(false);

  // Side Effect
  useEffect(() => {
    setupMusicPlayer()
      .then(() => {
        isInitialized.current = true;
        onLoad?.();
      })
      .catch((err) => {
        isInitialized.current = false;
        console.error(err);
      });
  }, [onLoad]);
};
