// import { Asset } from "expo-media-library";
// import UnknownTrack from "@/assets/images/unknown_track.png";

// export const generateSingleTrack = ({
//   track,
//   albumName,
//   coverImage,
// }: {
//   track: Asset;
//   albumName: string;
//   coverImage: string | null;
// }) => {
//   const trackItem: any = {
//     url: track.uri,
//     title: track.filename,
//     artist: "Unknown",
//     album: albumName || track.filename,
//     albumArtUri: track.uri,
//     artwork: String(coverImage) || UnknownTrack,
//     duration: convertDurationSecondsToMilliseconds(track.duration),
//     id: track.id,
//   };

//   return trackItem;
// };

// export const convertDurationSecondsToMilliseconds = (sec: number) => {
//   return sec * 1000;
// };
