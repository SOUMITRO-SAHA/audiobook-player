import { ToastAndroid } from "react-native";
import TrackPlayer from "react-native-track-player";
import { db } from "../db";
import { timestamp } from "../db/schema";

const DEFAULT_INTERVAL = 2; // 2 minutes in milliseconds

/**
 * This function updates the timestamp of the active track in a background loop
 * with retry mechanism for failed updates.
 * @param interval Interval in minutes (optional, defaults to 2)
 * @param retryCount Number of retries for failed updates (optional, defaults to 10)
 */
export const updateTimeStampOfActiveTrack = async ({
  retryCount = 10,
} = {}) => {
  const updateLoop = async () => {
    let attempts = 0;
    while (attempts < retryCount) {
      try {
        await updateActiveTimeStamp();
        return;
      } catch (error) {
        attempts++;
        console.error(
          `Error updating timestamp (attempt ${attempts}/${retryCount})`,
          error
        );
        if (attempts === retryCount) {
          console.error("Failed to update timestamp after all retries.");
          ToastAndroid.show("Failed to update timestamp", ToastAndroid.LONG);
        }
      }
    }
  };

  return updateLoop();
};

/**
 * Updates the timestamp of the active track in the database.
 * @returns A Promise that resolves if the update is successful, or rejects with an error.
 */
export const updateActiveTimeStamp = async () => {
  const activeTrack = await TrackPlayer.getActiveTrack();
  if (!activeTrack) {
    console.info("No active track found, skipping update.");
    return;
  }

  const { position } = await TrackPlayer.getProgress();
  await db
    .insert(timestamp)
    .values({
      trackUrl: activeTrack.url,
      timestamp: String(position),
      title: activeTrack.title,
    })
    .onConflictDoUpdate({
      target: timestamp.trackUrl,
      set: {
        timestamp: String(position),
        title: activeTrack.title,
        trackUrl: activeTrack.url,
      },
    });

  console.log("Time Interval Updated | Current Position: ", position);
};

export const stopPlayer = async () => {
  await TrackPlayer.stop();
};
