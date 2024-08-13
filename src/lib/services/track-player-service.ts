import { useTrackPlayerStore } from "@/store";
import * as React from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  Track,
  useTrackPlayerEvents,
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

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
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

        // Initializing the playback service
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

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackActiveTrackChanged,
];

export const useLogTrackPlayerState = () => {
  useTrackPlayerEvents(events, async (event) => {
    if (event.type === Event.PlaybackState) {
      console.log("Playback state: ", event.state);
    }
    if (event.type === Event.PlaybackError) {
      console.error(`An error occurred: `, event);
    }
    if (event.type === Event.PlaybackActiveTrackChanged) {
      console.info("Track Change: ", event.index);
    }
  });
};

export async function addTracks(track: Track) {
  await TrackPlayer.add([track]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => await TrackPlayer.skipToNext()
  );

  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    async () => await TrackPlayer.skipToPrevious()
  );
};
