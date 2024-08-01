import * as React from "react";
import TrackPlayer, { RepeatMode } from "react-native-track-player";

const setUpPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 10,
    });

    // After Initiating the player
    await TrackPlayer.setVolume(0.25);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  } catch (error) {}
};

const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
  // Managing a variable
  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    setUpPlayer()
      .then(() => {
        isInitialized.current = true;
        onLoad?.();
      })
      .catch((error) => {
        console.log(error);
        isInitialized.current = false;
      });
  }, [onLoad]);
};

export default useSetupTrackPlayer;
