import { Asset } from "expo-media-library";
import * as React from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  Track,
  useTrackPlayerEvents,
} from "react-native-track-player";

import { usePlaylistStore, useTrackPlayerStore } from "@/store";
import { extractLocalUrl } from "../utils";

const InitializePlaybackService = async () => {
  // Initializing the player
  await TrackPlayer.setupPlayer({
    autoUpdateMetadata: true,
    autoHandleInterruptions: true,
  });

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
    // progressUpdateEventInterval: 2,
  });

  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
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

// Helper function to create a Track object from an Asset
export const formTrackFromAsset = (
  asset: Asset,
  coverImage?: string,
  albumName?: string
): Track => ({
  id: asset.id,
  url: asset.uri,
  title: asset.filename,
  duration: asset.duration,
  artist: "Unknown", // Default artist
  album: albumName || asset.filename,
  artwork: coverImage || undefined,
});

// Adds a single track and plays it
export const addSingleTrack = async (asset: Asset) => {
  try {
    const { coverImage } = usePlaylistStore.getState();
    const fileLocalUrl = extractLocalUrl(asset.uri);
    const track = formTrackFromAsset(
      { ...asset, uri: fileLocalUrl || asset.uri },
      coverImage
    );

    await TrackPlayer.reset(); // Ensures there's no other track playing
    await TrackPlayer.add([track]);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    await TrackPlayer.play();
  } catch (error) {
    console.error("Failed to add and play track:", error);
  }
};

// Adds multiple tracks to the playlist and plays them
export const addTracks = async (assets: Asset[]) => {
  try {
    const { coverImage, setPlaylist, playlistName } =
      usePlaylistStore.getState();

    const tracks = assets.map((asset) => {
      const fileLocalUrl = extractLocalUrl(asset.uri);

      return formTrackFromAsset(
        { ...asset, uri: fileLocalUrl || asset.uri },
        coverImage,
        playlistName
      );
    });

    // Setting the playlist in the store
    setPlaylist(tracks);

    // Resetting and adding the new tracks to TrackPlayer
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    await TrackPlayer.play();
  } catch (error) {
    console.error("Failed to add and play tracks:", error);
  }
};

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
