import TrackPlayer, { Event } from "react-native-track-player";

export const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext()
  );

  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious()
  );
};
