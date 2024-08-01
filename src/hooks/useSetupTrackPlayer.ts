import * as React from "react";
import TrackPlayer, { RepeatMode } from "react-native-track-player";

const setUpPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();

    // After Initiating the player
    await TrackPlayer.setVolume(0.5);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  } catch (error) {
    console.error(error);
    throw error;
  }
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
