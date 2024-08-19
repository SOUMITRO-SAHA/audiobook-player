import { eq, InferModelFromColumns, InferSelectModel } from "drizzle-orm";
import { ToastAndroid } from "react-native";
import { Track } from "react-native-track-player";
import { db } from "../db";
import { playlist, playlistTrack, timestamp, track } from "../schema";

export const getPlaylistWithPlayingTrack = async (): Promise<any | null> => {
  try {
    // Find the track that is currently playing
    const playingTrack = await getLastActiveTrack();

    if (!playingTrack) {
      console.info("No track is currently playing.");
      return null;
    }

    // Find the playlist that contains this track
    const playlistWithPlayingTrack = await db.query.playlistTrack.findFirst({
      where: eq(playlistTrack.trackId, playingTrack.id),
    });

    if (!playlistWithPlayingTrack) {
      console.info("No playlist contains the currently playing track.");
      return null;
    }

    // Get the playlist details
    const playlistDetails = await db.query.playlist.findFirst({
      where: eq(playlist.id, playlistWithPlayingTrack.playlistId),
    });

    return playlistDetails;
  } catch (error) {
    console.error("Error fetching playlist with playing track:", error);
    return null;
  }
};

type ActiveTrackType = InferSelectModel<typeof track>;

export const getLastActiveTrack = async (): Promise<
  ActiveTrackType | undefined
> => {
  try {
    // Find the track that is currently playing
    const activeTrack = await db.query.track.findFirst({
      where: eq(track.isPlaying, true),
    });

    return activeTrack;
  } catch (error) {
    console.error("Error fetching last active track:", error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
};

export const updateActivePlayingTrackInDb = async (t: Track) => {
  try {
    return await db
      .update(track)
      .set({
        isPlaying: true,
        lastPlayed: Date.now(),
      })
      .where(eq(track.url, t?.url))
      .returning({
        id: track.id,
        isPlaying: track.isPlaying,
      });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
};

type TimeStampType = {
  id: number;
  timestamp: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  title: string | null;
  trackUrl: string;
};

export const getAllTimeStamps = async () => {
  try {
    return db.query.timestamp.findMany();
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
};

export const getLastPlayingTimeStamp = async (t: Track) => {
  try {
    let timestampInfo = await db.query.timestamp.findFirst({
      where: eq(timestamp.trackUrl, t.url),
    });

    if (!timestampInfo) {
      // Then create a new default timestamp
      const newTimeStamp = await db
        .insert(timestamp)
        .values({
          trackUrl: t.url,
          timestamp: "0.00",
          title: t.title,
        })
        .returning();

      if (newTimeStamp && newTimeStamp.length > 0) {
        timestampInfo = newTimeStamp[0];
      }
    }

    return timestampInfo;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    return undefined;
  }
};

export const updateLastPlayingTimeStamp = async (
  t: Track,
  position: string
): Promise<TimeStampType | undefined> => {
  try {
    const res = await db
      .insert(timestamp)
      .values({
        trackUrl: t.url,
        timestamp: position,
        title: t.title,
      })
      .onConflictDoUpdate({
        target: timestamp.trackUrl,
        set: {
          timestamp: position,
          title: t.title,
          trackUrl: t.url,
        },
      })
      .returning();

    if (res.length > 0) {
      return res[0] as TimeStampType;
    }

    return undefined;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
    return undefined;
  }
};
