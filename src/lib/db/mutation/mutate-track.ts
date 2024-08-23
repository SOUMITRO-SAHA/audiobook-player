import { ToastAndroid } from "react-native";
import { eq } from "drizzle-orm";
import { Track } from "react-native-track-player";

import { retryAsyncOperation } from "@/lib/utils";
import { playlist, playlistTrack, track } from "../schema";
import { db } from "../db";
import { usePlaylistStore } from "@/store";

type UpsertTrackType = {
  id: number;
};

export const upsertTracks = async (
  tracks: Track[]
): Promise<UpsertTrackType[]> => {
  const allTracksInfo: UpsertTrackType[] = [];

  try {
    // First Resetting the other active tracks
    await db
      .update(track)
      .set({
        isPlaying: false,
      })
      .where(eq(track.isPlaying, true));

    // Sort tracks by filename
    const sortedTracks = tracks
      .filter((i) => i.title)
      .sort((a, b) => {
        if (!a?.title || !b?.title) {
          return 0;
        }

        return a.title.localeCompare(b.title);
      });

    const responses = await Promise.all(
      sortedTracks.map((track) =>
        retryAsyncOperation(() => upsertSingleTrack(track, false), 5)
      )
    );

    responses.forEach((response) => {
      if (response) {
        allTracksInfo.push(response);
      }
    });

    return allTracksInfo;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    return allTracksInfo;
  }
};
export const upsertSingleTrack = async (
  t: Track,
  shouldUpdatePreviousTracks: boolean = true
): Promise<{ id: number } | null> => {
  try {
    if (shouldUpdatePreviousTracks) {
      // Resetting other active tracks
      await db
        .update(track)
        .set({
          isPlaying: false,
        })
        .where(eq(track.isPlaying, true));
    }

    // First Check whether the track is already present or not:
    const existingTrack = await db.query.track.findFirst({
      where: eq(track.url, t.url),
    });

    if (!existingTrack) {
      // Insert or update the track
      const newTrackInDb = await db
        .insert(track)
        .values({
          title: String(t.title),
          url: String(t.url),
          duration: String(t.duration),
          artist: t.artist || null,
          album: t.album || null,
          artwork: t.artwork || null,
          isPlaying: true,
          lastPlayed: Date.now(),
        })
        .onConflictDoUpdate({
          target: track.url,
          set: {
            title: String(t.title),
            url: String(t.url),
            duration: String(t.duration),
            artist: t.artist || null,
            album: t.album || null,
            artwork: t.artwork || null,
            isPlaying: true,
            lastPlayed: Date.now(),
          },
        })
        .returning({ id: track.id });

      return newTrackInDb?.[0] || null;
    } else {
      // Just Update the track
      const updatedTrack = await db
        .update(track)
        .set({
          title: String(t.title),
          url: String(t.url),
          duration: String(t.duration),
          artist: t.artist || null,
          album: t.album || null,
          artwork: t.artwork || null,
          isPlaying: true,
          lastPlayed: Date.now(),
        })
        .returning({ id: track.id });

      return updatedTrack?.[0] || null;
    }
  } catch (error) {
    console.error("Error upserting track:", error);
    return null;
  }
};

export const createPlaylistItems = async ({
  tracks,
}: {
  tracks: UpsertTrackType[];
}): Promise<boolean> => {
  try {
    const { coverImage, playlistName } = usePlaylistStore.getState();

    // Check if the playlist already exists
    const existingPlaylist = await db.query.playlist.findFirst({
      where: eq(playlist.name, playlistName),
    });

    // If the playlist does not exist, create it
    if (!existingPlaylist) {
      const newPlaylist = await db
        .insert(playlist)
        .values({
          name: playlistName,
          coverImage: coverImage,
        })
        .returning({
          id: playlist.id,
        });

      if (!newPlaylist || newPlaylist.length === 0) {
        console.error(`Failed to create playlist with name "${playlistName}".`);
        return false;
      } else {
        const firstPlaylist = newPlaylist[0];

        // Get existing playlist tracks
        const existingPlaylistTracks = await db.query.playlistTrack.findMany({
          where: eq(playlistTrack.playlistId, firstPlaylist.id),
        });

        const existingTrackIds = new Set(
          existingPlaylistTracks.map((pt) => pt.trackId)
        );

        // Filter out tracks that already exist in the playlist
        const newTracks = tracks.filter(
          (track) => !existingTrackIds.has(track.id)
        );

        if (newTracks.length > 0) {
          // Use a transaction to ensure all inserts succeed or fail together
          await db.transaction(async (trx) => {
            await Promise.all(
              newTracks.map((track, index) =>
                trx.insert(playlistTrack).values({
                  playlistId: firstPlaylist.id,
                  trackId: track.id,
                  order: index + 1,
                })
              )
            );
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error creating playlist items:", error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    return false;
  }
};
