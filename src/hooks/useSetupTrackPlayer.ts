import { useTrackPlayerStore } from "@/store";
import * as React from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";

const InitializePlaybackService = async () => {
  // Initializing the player
  await TrackPlayer.setupPlayer();

  // After Initiating the player
  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
    ],
    progressUpdateEventInterval: 2,
  });
};

const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
  const { isSetup, setIsSetup } = useTrackPlayerStore();

  // Function
  const setUpPlayer = async () => {
    let attempts = 0;
    const maxAttempt = 10;
    while (!isSetup && attempts < maxAttempt) {
      try {
        const status = await TrackPlayer.getPlaybackState();

        if (status.state === "error") {
          // Initializing the playback service
          await InitializePlaybackService();
        } else {
          setIsSetup(true);
          break;
        }
      } catch (error) {
        attempts++;

        await InitializePlaybackService();
        console.info("Failed to setup TrackPlayer, retrying...", attempts);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return isSetup;
  };

  // Managing a variable
  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    (async () => {
      let isSetup = await setUpPlayer();
      onLoad?.();

      if (isSetup) {
        isInitialized.current = true;
      }
    })();
  }, [onLoad]);

  return isInitialized;
};

export default useSetupTrackPlayer;
