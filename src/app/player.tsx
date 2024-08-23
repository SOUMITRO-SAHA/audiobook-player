import musicDefaultImage from "@/assets/images/unknown_track.png";
import { ThemedButton } from "@/components";
import { FastImageComponent } from "@/components/image";
import { MovingText, PlayerControls } from "@/components/player";
import PlayerFeatures from "@/components/player/player-features";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, screenPadding } from "@/constants";
import { useBackgroundImageColor } from "@/hooks/useBackgroundImageColor";
import { db } from "@/lib/db";
import { trackSection } from "@/lib/db/schema";
import { cn, formatTime, formatTimestamp } from "@/lib/utils";
import { defaultStyles } from "@/styles";
import { Feather, Octicons } from "@expo/vector-icons";
import { eq, InferSelectModel } from "drizzle-orm";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, {
  Track,
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

const AudioPlayer = () => {
  // States
  const [shouldShowQueues, setShouldShowQueues] = React.useState(false);
  const [queue, setQueue] = React.useState<Track[] | null>(null);
  const [trackSections, setTrackSections] = React.useState<
    InferSelectModel<typeof trackSection>[] | null
  >(null);
  const [activeTab, setActiveTab] = React.useState<0 | 1>(0);

  // HOOKS
  const { top, bottom } = useSafeAreaInsets();
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  // Side Effect
  React.useEffect(() => {
    const getQueue = async () => {
      const queue = await TrackPlayer.getQueue();

      if (queue && queue.length > 1) {
        setActiveTab(1);
        setQueue(queue);
      }
    };

    const getTrackSections = async () => {
      if (activeTrack) {
        const trackSections = await db.query.trackSection.findMany({
          where: eq(trackSection.trackUrl, activeTrack?.url),
        });
        setTrackSections(trackSections);
      }
    };

    const timeId = setTimeout(() => {
      getQueue();
      getTrackSections();
    }, 100);
    return () => clearTimeout(timeId);
  }, []);

  // Background Color
  const activeImageBackgroundColor = useBackgroundImageColor(
    activeTrack ? activeTrack.artwork : musicDefaultImage
  );

  if ((!activeTrack && !playing) || !activeImageBackgroundColor) {
    return (
      <View style={styles.overlayContainer}>
        <ThemedView className="flex flex-row items-center justify-center w-full h-full bg-transparent">
          <ActivityIndicator size={50} color={Colors.dark.primary} />
        </ThemedView>
      </View>
    );
  }

  return (
    <>
      <LinearGradient
        style={{ flex: 1 }}
        colors={
          activeImageBackgroundColor
            ? [
                activeImageBackgroundColor.primary,
                activeImageBackgroundColor.secondary,
              ]
            : [Colors.dark.primary, Colors.dark.destructive]
        }
        start={{ x: 0, y: 0.1 }}
      >
        <View style={styles.overlayContainer}>
          <DismissPlayerSymbol />
          {activeTrack && (
            <ThemedView
              className="relative"
              style={{
                flex: 1,
                marginTop: top,
                marginBottom: bottom,
                backgroundColor: "transparent",
              }}
            >
              <FastImageComponent
                style={styles.coverImage}
                source={
                  activeTrack && activeTrack.artwork
                    ? activeTrack.artwork
                    : musicDefaultImage
                }
              />
              <ThemedText
                className="mt-3 text-center"
                style={{
                  color: Colors.dark.text,
                }}
              >
                {activeTrack && activeTrack.album}
                {activeTrack && ` | ${activeTrack.artist}`}
              </ThemedText>

              {/* Track Title */}
              <View
                style={styles.trackTitleContainer}
                className="mx-auto space-x-2"
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setShouldShowQueues((prev) => !prev)}
                >
                  <Feather
                    name="list"
                    size={24}
                    color={Colors.dark.foreground}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <MovingText
                    text={activeTrack.title as string}
                    animationThreshold={30}
                  />
                </View>
              </View>

              {/* Player Controls */}
              <PlayerControls />

              {/* Player Features */}
              <PlayerFeatures />
            </ThemedView>
          )}
        </View>
      </LinearGradient>

      {/* Modals */}
      <Modal
        visible={shouldShowQueues}
        onRequestClose={() => setShouldShowQueues((prev) => !prev)}
        animationType="fade"
        transparent
      >
        <ThemedView className="flex items-center justify-center w-full h-full bg-transparent">
          <ThemedView
            className="w-[90%] h-[90%] rounded-xl p-10 relative"
            style={{
              backgroundColor: Colors.dark.muted,
            }}
          >
            <View className="absolute top-0 right-0">
              <ThemedButton
                onPress={() => setShouldShowQueues((prev) => !prev)}
                size="icon"
                variant="ghost"
              >
                <Octicons name="x" size={24} color={Colors.dark.text} />
              </ThemedButton>
            </View>

            {/* Tabs */}
            <View className="flex flex-row items-center justify-between mb-5">
              <ThemedButton
                onPress={() => {
                  setActiveTab(0);
                }}
                style={{
                  backgroundColor:
                    activeTab === 0
                      ? Colors.dark.primary
                      : Colors.dark.mutedForeground,
                }}
                className={cn("w-[150px]")}
              >
                <ThemedText>Custom Section</ThemedText>
              </ThemedButton>
              <ThemedButton
                onPress={() => {
                  setActiveTab(1);
                }}
                style={{
                  backgroundColor:
                    activeTab === 1
                      ? Colors.dark.primary
                      : Colors.dark.mutedForeground,
                }}
                className="w-[100px]"
              >
                <ThemedText>Queue</ThemedText>
              </ThemedButton>
            </View>

            {activeTab === 0 ? (
              <FlatList
                data={trackSections}
                renderItem={({ item, index }) => {
                  return (
                    <View className="p-1 bg-slate-600 rounded-xl">
                      <ThemedButton
                        key={item.id}
                        variant="ghost"
                        onPress={async () => {
                          if (item.timestamp)
                            await TrackPlayer.seekTo(Number(item.timestamp));

                          setShouldShowQueues((prev) => !prev);
                        }}
                      >
                        <View className="flex flex-row items-center justify-between w-full space-x-5 ">
                          <ThemedText>
                            {item.title} {index + 1}
                          </ThemedText>

                          <ThemedText>
                            {formatTime(Number(item.timestamp))}
                          </ThemedText>
                        </View>
                      </ThemedButton>
                    </View>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <ThemedButton onPress={() => {}} variant="ghost">
                      <ThemedText>No items in the queue.</ThemedText>
                    </ThemedButton>
                  );
                }}
              />
            ) : (
              <FlatList
                data={queue}
                renderItem={({ item, index }) => {
                  return (
                    <View className="flex my-2 space-y-5">
                      <ThemedButton
                        onPress={() => {}}
                        variant="ghost"
                        style={{
                          backgroundColor: Colors.dark.background,
                        }}
                      >
                        <ThemedText className="text-base">
                          {item.title} {index + 1}
                        </ThemedText>
                      </ThemedButton>
                    </View>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <ThemedButton onPress={() => {}} variant="ghost">
                      <ThemedText>No items in the queue.</ThemedText>
                    </ThemedButton>
                  );
                }}
              />
            )}
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  );
};

const DismissPlayerSymbol = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: top + 10,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        accessible={false}
        style={{
          width: 50,
          height: 8,
          borderRadius: 8,
          backgroundColor: "#fff",
          opacity: 0.7,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: "rgba(0, 0, 0, 0.009)",
    padding: 50,
  },
  coverImage: {
    flex: 1,
    borderRadius: 12,
    maxHeight: "50%",
    width: "69%",
    marginHorizontal: "auto",
    overflow: "hidden",
    backgroundColor: Colors.dark.muted,
  },

  trackTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AudioPlayer;
