import { Asset } from "expo-media-library";
import TrackPlayer, { Track } from "react-native-track-player";

export const generateSingleTrack = ({
  track,
  albumName,
  coverImage,
}: {
  track: Asset;
  albumName: string;
  coverImage: string | null;
}) => {
  const trackItem: Track = {
    url: track.uri,
    title: track.filename,
    artist: "Unknown",
    album: albumName,
    albumArtUri: track.uri,
    artwork: String(coverImage),
    duration: convertDurationSecondsToMilliseconds(track.duration),
    id: track.id,
  };

  return trackItem;
};

export const convertDurationSecondsToMilliseconds = (sec: number) => {
  return sec * 1000;
};

export const addSingleTrack = async (track: Track) => {
  try {
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  } catch (error) {
    console.log(error);
  }
};
