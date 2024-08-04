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
            source={
              activeTrack.artwork ?? "https://picsum.photos/seed/696/3000/2000"
            }
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />

          {/* Track Title */}
          <View style={styles.trackTitleContainer}>
            <MovingText
              text={activeTrack?.title ?? "Demo Text for now"}
              animationThreshold={30}
            />
          </View>
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
    maxHeight: 256,
    overflow: "hidden",
    backgroundColor: Colors.dark.muted,
  },

  trackTitleContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
});

export default AudioPlayer;
