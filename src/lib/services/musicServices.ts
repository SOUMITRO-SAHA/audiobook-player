import TrackPlayer, { Event, RepeatMode } from "react-native-track-player";

export async function addTrack() {
  const track = {
    id: "1",
    url: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
    title: "Track Title",
    artist: "Artist Name",
    album: "Album Name",
    genre: "Genre",
    duration: 60, // ms
    artwork: "https://example.com/cover.jpg",
  };

  await TrackPlayer.add({ ...track });
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);

  await TrackPlayer.play();
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
