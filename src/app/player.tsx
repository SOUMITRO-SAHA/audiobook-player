import ParallaxScrollView from "@/components/ParallaxScrollView";
import { MovingText } from "@/components/player";
import { ThemedView } from "@/components/ThemedView";
import { Colors, screenPadding } from "@/constants";
import { defaultStyles } from "@/styles";
import { Image } from "expo-image";
import * as React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";
import UnknownTrack from "@/assets/images/unknown_track.png";
import { ThemedText } from "@/components/ThemedText";
import { Feather } from "@expo/vector-icons";
import PlayerProgressBar from "@/components/player/player-progress-bar";
import PlayerAdvanceController from "@/components/player/player-advance-controller";
import PlayerFeatures from "@/components/player/player-features";

const AudioPlayer = () => {
  const { top, bottom } = useSafeAreaInsets();

  const activeTrack = useActiveTrack();

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  if (!activeTrack) {
    return (
      <View style={styles.overlayContainer}>
        <ThemedView className="flex flex-row items-center justify-center w-full h-full bg-transparent">
          <ActivityIndicator size={50} color={Colors.dark.primary} />
        </ThemedView>
      </View>
    );
  }

  return (
    <View style={styles.overlayContainer}>
      <DismissPlayerSymbol />
      {activeTrack && (
        <ThemedView
          style={{
            flex: 1,
            marginTop: top,
            marginBottom: bottom,
            backgroundColor: "transparent",
          }}
        >
          <Image
            style={styles.coverImage}
            source={UnknownTrack}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
          <ThemedText className="mt-3 text-center text-gray-400">
            {activeTrack.album}
          </ThemedText>

          {/* Track Title */}
          <View
            style={styles.trackTitleContainer}
            className="mx-auto space-x-5"
          >
            <Feather name="list" size={24} color={Colors.dark.foreground} />
            <MovingText
              text={activeTrack.title ?? ""}
              animationThreshold={30}
            />
          </View>

          {/* Player Progress Bar */}
          <PlayerProgressBar />

          {/* Player Controller */}
          <PlayerAdvanceController />

          {/* Player Features */}
          <PlayerFeatures />
        </ThemedView>
      )}
    </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 50,
  },
  coverImage: {
    flex: 1,
    borderRadius: 12,
    maxHeight: "50%",
    width: "90%",
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
