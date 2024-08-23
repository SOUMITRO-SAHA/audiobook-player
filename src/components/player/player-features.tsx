import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet";
import { and, eq } from "drizzle-orm";
import { BlurView } from "expo-blur";
import * as React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from "react-native-track-player";

import { Colors } from "@/constants";
import useSleepTimer from "@/hooks/useSleepTimer";
import { db } from "@/lib/db";
import { playbackSettings, timestamp, trackSection } from "@/lib/db/schema";
import { formatTime } from "@/lib/utils";
import { usePlaylistStore } from "@/store";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BottomSheet } from "../bottom-sheet";
import { InputBox } from "../ui";

export const speedOptions = [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

interface TimerOption {
  label: string;
  value: number;
}

const timerOptions = [
  { label: "1 mins", value: 1 },
  { label: "30 mins", value: 30 },
  { label: "45 mins", value: 45 },
  { label: "60 mins", value: 60 },
  { label: "1h30m", value: 90 },
  { label: "2hr", value: 120 },
  // { label: "End of this Chapter", value: null },
  // Add "End Of Chapter" logic here
];

const PlayerFeatures = () => {
  // Hooks
  const { position, duration } = useProgress();
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  // Store
  const { playbackSpeed, setPlaybackSpeed } = usePlaylistStore();

  // Timer
  const [timer, setTimer] = React.useState<number | null>(null);

  // Time Stamp
  const [showTimeStamp, setShowTimeStamp] = React.useState(false);
  const [timeStampTitle, setTimeStampTitle] = React.useState("Part");
  const [lockedPosition, setLockedPosition] = React.useState(0);
  const [currentTimeStampPosition, setCurrentTimeStampPosition] =
    React.useState(0);
  const [timeStampLoading, setTimeStampLoading] = React.useState(false);

  // Refs
  const speedRef = React.useRef<BottomSheetModal>(null);
  const timerRef = React.useRef<BottomSheetModal>(null);

  // Calling Timer Hook
  useSleepTimer(timer);

  const handleTimerSelect = (time: number | null) => {
    if (time === null) {
      // INFO: Will do this later | Priority -1
      // const remainingTimeInSeconds = Math.abs(duration - position);
      // setTimer(remainingTimeInSeconds / 60);
    } else {
      if (playing) {
        setTimer(time);

        ToastAndroid.show("Timer set for " + time, ToastAndroid.LONG);
        timerRef.current?.close();
      } else {
        ToastAndroid.show(
          "Cannot set timer while Player paused",
          ToastAndroid.SHORT
        );
      }
    }
  };

  // Functions
  const handleSpeedChange = React.useCallback(async (speed: number) => {
    await TrackPlayer.setRate(speed);
    setPlaybackSpeed(speed);

    // Also Update the speed in the Database
    await db
      .update(playbackSettings)
      .set({
        speed,
      })
      .where(eq(playbackSettings.id, 1));
  }, []);

  const getAllTimeStampsOfActiveTrack = async (retryCount = 0) => {
    if (!activeTrack) {
      return;
    }

    try {
      const trackSection = await db.query.trackSection.findMany({
        where: eq(timestamp.trackUrl, activeTrack.url),
      });

      if (trackSection.length > 0) {
        setCurrentTimeStampPosition(trackSection.length);
      }
      return trackSection;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }

      if (retryCount < 5) {
        console.warn(
          `Error fetching timestamps (attempt ${retryCount + 1}/5). Retrying...`
        );
        return getAllTimeStampsOfActiveTrack(retryCount + 1); // Retry
      } else {
        console.error("Failed to fetch timestamps after 5 retries.");
        return [];
      }
    }
  };

  const handleSaveTimeStamp = React.useCallback(
    async (retryCount = 0) => {
      setTimeStampLoading(true);
      if (!activeTrack) {
        return;
      }

      try {
        // First checking whether this track Section exists or not
        const existingTrackSection = await db.query.trackSection.findFirst({
          where: and(
            eq(timestamp.trackUrl, activeTrack.url),
            eq(timestamp.timestamp, String(lockedPosition))
          ),
        });

        if (!existingTrackSection) {
          await db.insert(trackSection).values({
            trackUrl: activeTrack.url,
            timestamp: String(lockedPosition),
            title: timeStampTitle,
          });
          ToastAndroid.show("Timestamp saved successfully!", ToastAndroid.LONG);
          setShowTimeStamp(false);
        } else {
          ToastAndroid.show(
            "This timestamp already exists!",
            ToastAndroid.LONG
          );
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }

        if (retryCount < 5) {
          console.warn(
            `Error saving timestamp (attempt ${retryCount + 1}/5). Retrying...`
          );
          return handleSaveTimeStamp(retryCount + 1); // Retry
        } else {
          console.error("Failed to save timestamp after 5 retries.");
        }
      } finally {
        setTimeStampLoading(false);
      }
    },
    [lockedPosition]
  );

  // Side Effects
  React.useEffect(() => {
    (async () => {
      const playbackSettings = await db.query.playbackSettings.findFirst();

      if (playbackSettings) {
        if (playbackSettings.speed) {
          setPlaybackSpeed(playbackSettings.speed);

          // Also Update the speed of the Player
          await TrackPlayer.setRate(playbackSettings.speed);
        }
      }
    })();
  }, []);

  return (
    <View className="flex flex-row mt-6 -mb-8 justify-evenly">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          speedRef.current?.present();
        }}
      >
        <View className="items-center justify-center w-20 h-16 p-3 shadow rounded-xl bg-black/50">
          <ThemedText>{playbackSpeed}x</ThemedText>
          <ThemedText>Speed</ThemedText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          timerRef.current?.present();
        }}
      >
        <View className="flex items-center justify-center w-20 h-16 p-3 shadow rounded-xl bg-black/50">
          <MaterialCommunityIcons
            name="timer-outline"
            size={24}
            color={Colors.dark.foreground}
          />
          <ThemedText>Timer</ThemedText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={async () => {
          setLockedPosition(position);
          setShowTimeStamp((prev) => !prev);

          await getAllTimeStampsOfActiveTrack();
        }}
      >
        <View className="flex items-center justify-center w-20 h-16 p-2 shadow rounded-xl bg-black/50">
          <MaterialCommunityIcons
            name="notebook-plus"
            size={24}
            color={Colors.dark.foreground}
          />
          <ThemedText className="text-xs">Time Stamp</ThemedText>
        </View>
      </TouchableOpacity>

      {/* Bottom Sheet | Speed  */}
      <BottomSheet ref={speedRef} initialPosition={18}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {speedOptions.map((speed) => (
            <TouchableOpacity
              key={speed}
              onPress={() => handleSpeedChange(speed)}
              style={[
                {
                  alignItems: "center",
                  backgroundColor: Colors.dark.mutedForeground,
                  padding: 10,
                  borderRadius: 10,
                  width: 60,
                },
                speed === playbackSpeed && {
                  backgroundColor: Colors.dark.primary,
                },
              ]}
            >
              <Text>{speed}x</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* Bottom Sheet | Sleeping Timer */}
      <BottomSheet ref={timerRef} initialPosition={48}>
        <View style={{ width: "100%", gap: 10 }}>
          {timerOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              onPress={() => handleTimerSelect(option.value)}
            >
              <Text
                className="w-full text-center bg-slate-500"
                style={{
                  color: Colors.dark.text,
                  padding: 5,
                  borderRadius: 10,
                  fontSize: 18,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              timerRef.current?.close();
            }}
          >
            <Text
              className="w-full text-center"
              style={{
                color: Colors.dark.text,
                backgroundColor: Colors.dark.primary,
                padding: 5,
                borderRadius: 10,
                fontSize: 18,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* Bottom Sheet | Time Stamp */}
      <Modal
        visible={showTimeStamp}
        onRequestClose={() => setShowTimeStamp(!showTimeStamp)}
        animationType="fade"
        transparent
      >
        <View style={styles.overlay}>
          <BlurView intensity={80} style={styles.blurView} tint="dark">
            <View style={[styles.modalContent]}>
              <View className="flex flex-row items-center justify-between mb-6 space-x-5">
                <ThemedText className="text-xl text-black font-[700]">
                  Add Time Stamp
                </ThemedText>
                <ThemedText
                  className="p-1 px-3 text-lg rounded-full"
                  style={{ backgroundColor: Colors.dark.background }}
                >
                  {formatTime(lockedPosition)}
                </ThemedText>
              </View>
              <InputBox
                state={`${timeStampTitle} ${currentTimeStampPosition}`}
                setState={setTimeStampTitle}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity activeOpacity={0.75}>
                  <Pressable
                    onPress={async () => {
                      await handleSaveTimeStamp();
                    }}
                  >
                    <ThemedView
                      className="flex items-center justify-center w-full h-12 mt-5 rounded-xl"
                      style={{ backgroundColor: Colors.dark.background }}
                    >
                      {timeStampLoading ? (
                        <ActivityIndicator
                          size={30}
                          color={Colors.dark.primary}
                        />
                      ) : (
                        <ThemedText className="text-lg">Save</ThemedText>
                      )}
                    </ThemedView>
                  </Pressable>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    backgroundColor: Colors.dark.primary,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    width: "100%",
    zIndex: 999,
  },
});

export default PlayerFeatures;
