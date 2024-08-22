import { usePlaylistStore } from "@/store";
import { Asset } from "expo-media-library";
import TrackPlayer, { RepeatMode, Track } from "react-native-track-player";
import { upsertSingleTrack } from "../db/mutation";
import { extractLocalUrl, retryAsyncOperation, sleep } from "../utils";
import { fetchBookInfo } from "./fetch-book-info";

/**
 * Creates a Track object from an Asset object and optional metadata.
 *
 * @param {Object} params - Function parameters.
 * @param {Asset} params.asset - The audio asset.
 * @param {string} [params.coverImage] - Optional cover image URL.
 * @param {string} [params.albumName] - Optional album name.
 * @param {string} [params.artist] - Optional artist name.
 * @returns {Track} The created Track object.
 */

export const formTrackFromAsset = ({
  asset,
  coverImage,
  albumName,
  artist,
}: {
  asset: Asset;
  coverImage?: string;
  albumName?: string;
  artist?: string;
}): Track => ({
  id: asset.id,
  url: asset.uri,
  title: asset.filename,
  duration: asset.duration,
  artist: artist || "Unknown", // Default artist
  album: albumName || asset.filename,
  artwork: coverImage || undefined,
});

/**
 * Prepares a track object for playback, potentially fetching metadata.
 *
 * @param {Asset} asset - The audio asset.
 * @param {string|undefined} coverImage - Optional cover image URL.
 * @param {string|undefined} fileLocalUrl - Optional local URL for the asset.
 * @returns {Promise<Track>} A Promise resolving to an object containing the asset and metadata.
 */

const prepareTrackObject = async (
  asset: Asset,
  coverImage: string | undefined,
  fileLocalUrl: string | undefined
): Promise<Track> => {
  if (coverImage) {
    const trackObject = {
      asset: { ...asset, uri: fileLocalUrl || asset.uri },
      coverImage,
    };

    return formTrackFromAsset(trackObject);
  }

  const bookInfoFromGoogleBooks = await fetchBookInfo(asset.filename);

  const trackObject = {
    asset: { ...asset, uri: fileLocalUrl || asset?.uri },
    coverImage: bookInfoFromGoogleBooks?.coverImage || undefined,
    albumName: bookInfoFromGoogleBooks?.albumName || undefined,
    artist: bookInfoFromGoogleBooks?.authors?.join(", ") || undefined,
  };

  return formTrackFromAsset(trackObject);
};

/**
 * Prepares multiple Track objects for playback, potentially fetching metadata from Google Books for the first asset if no cover image is provided.
 *
 * @param {Asset[]} assets - Array of Asset objects representing audio files.
 * @param {string|undefined} coverImage - Optional cover image URL for all tracks.
 * @param {string|undefined} playlistName - Optional playlist name to use as album name if no cover image is provided.
 * @returns {Promise<Track[]>} A Promise resolving to an array of prepared Track objects.
 */

const prepareMultipleTrackObjects = async (
  assets: Asset[],
  coverImage: string | undefined,
  playlistName: string | undefined
): Promise<Track[]> => {
  if (!coverImage) {
    const bookInfoFromGoogleBooks = await fetchBookInfo(
      playlistName || assets[0].filename
    );

    coverImage = bookInfoFromGoogleBooks?.coverImage || undefined;
    const artist = bookInfoFromGoogleBooks?.authors?.join(", ") || undefined;
    const albumName = bookInfoFromGoogleBooks?.albumName || undefined;

    return assets?.map((asset) => {
      const fileLocalUrl = extractLocalUrl(asset.uri);
      return formTrackFromAsset({
        asset: { ...asset, uri: fileLocalUrl || asset.uri },
        coverImage,
        albumName: playlistName || albumName,
        artist,
      });
    });
  }

  return assets?.map((asset) => {
    const fileLocalUrl = extractLocalUrl(asset.uri);

    // Converting to Track Object
    return formTrackFromAsset({
      asset: { ...asset, uri: fileLocalUrl || asset.uri },
      coverImage,
      albumName: playlistName,
    });
  });
};

export const addSingleTrack = async ({
  asset,
  shouldReset = true,
  shouldPlay = true,
}: {
  asset: Asset;
  shouldReset?: boolean;
  shouldPlay?: boolean;
}) => {
  try {
    const { coverImage } = usePlaylistStore.getState();
    const fileLocalUrl = extractLocalUrl(asset.uri) || undefined;

    const track = await prepareTrackObject(asset, coverImage, fileLocalUrl);

    if (shouldReset) await TrackPlayer.reset();

    await TrackPlayer.add([track]);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);

    if (shouldPlay) await TrackPlayer.play();

    // Upsert the track, retrying up to 5 times if it fails
    await retryAsyncOperation(() => upsertSingleTrack(track), 5);
  } catch (error) {
    console.error("Failed to add and play track:", error);
  }
};

export const addTracks = async ({
  assets,
  shouldReset = true,
  shouldPlay = true,
}: {
  assets: Asset[];
  shouldReset?: boolean;
  shouldPlay?: boolean;
}) => {
  try {
    const { coverImage, playlistName } = usePlaylistStore.getState();

    const trackObjects = await prepareMultipleTrackObjects(
      assets,
      coverImage,
      playlistName
    );

    if (shouldReset) await TrackPlayer.reset();

    await TrackPlayer.add(trackObjects);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);

    await sleep(10);
    if (shouldPlay) await TrackPlayer.play();
  } catch (error) {
    console.error("Failed to add and play tracks:", error);
  }
};
