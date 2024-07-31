import TrackPlayer, { Event, Track } from "react-native-track-player";
import { Folder, Track as TrackFromDb } from "./types/database";

export async function setUpPlayer() {
  let isSetup = false;

  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTrack(t: TrackFromDb, f: Folder) {
  const track: Track = {
    id: t.id,
    url: t.uri,
    title: t.name,
    artist: "Test Artist",
    artwork: String(f.coverImage),
    album: f.name,
    duration: Number(t.duration),
  };

  await TrackPlayer.add(track);
  await TrackPlayer.play();
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
}
