import {
  default as musicDefaultImage,
  default as UnknownTrack,
} from "@/assets/images/unknown_track.png";
import { MovingText, PlayerControls } from "@/components/player";
import PlayerFeatures from "@/components/player/player-features";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, screenPadding } from "@/constants";
import { useAppContext } from "@/context/AppContext";
import { useBackgroundImageColor } from "@/hooks/useBackgroundImageColor";
import { defaultStyles } from "@/styles";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const AudioPlayer = () => {
  // HOOKS
  const { top, bottom } = useSafeAreaInsets();
  const currentTrack = useActiveTrack();
  const { playing } = useIsPlaying();
  const [coverImage, setCoverImage] = React.useState<string>(musicDefaultImage);
  const [artists, setArtists] = React.useState<string[] | null>(null);
  const [albumName, setAlbumName] = React.useState<string | null>(null);

  const { getBookInfo } = useAppContext();

  // Memoization
  React.useEffect(() => {
    const fetchBookInfo = async () => {
      if (currentTrack) {
        try {
          const bookInfo = await getBookInfo(currentTrack.title as string);

          if (currentTrack.artwork) {
            setCoverImage(currentTrack.artwork);
          } else if (bookInfo && bookInfo.length > 0) {
            const relevantInfo = bookInfo.find(
              (info) => !info?.authors?.includes("Unknown")
            );
            if (relevantInfo) {
              setCoverImage(relevantInfo.coverImage);
              setArtists(relevantInfo.authors);
              setAlbumName(relevantInfo.title);
            }
          }
        } catch (error) {
          console.error("Error fetching book info:", error);
        }
      }
    };

    fetchBookInfo();
  }, [currentTrack, getBookInfo]);

  // Background Color
  const activeImageBackgroundColor = useBackgroundImageColor(coverImage);

  if ((!currentTrack && !playing) || !activeImageBackgroundColor) {
    return (
      <View style={styles.overlayContainer}>
        <ThemedView className="flex flex-row items-center justify-center w-full h-full bg-transparent">
          <ActivityIndicator size={50} color={Colors.dark.primary} />
        </ThemedView>
      </View>
    );
  }

  return (
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
    >
      <View style={styles.overlayContainer}>
        <DismissPlayerSymbol />
        {currentTrack && (
          <ThemedView
            className="relative"
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
                currentTrack && currentTrack.artwork
                  ? currentTrack.artwork
                  : coverImage
                  ? coverImage
                  : UnknownTrack
              }
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
            <ThemedText
              className="mt-3 text-center"
              style={{
                color: Colors.dark.mutedForeground,
              }}
            >
              {albumName}
              {artists && ` | ${artists?.join(", ")}`}
            </ThemedText>

            {/* Track Title */}
            <View
              style={styles.trackTitleContainer}
              className="mx-auto space-x-2"
            >
              <Feather name="list" size={24} color={Colors.dark.foreground} />
              <View
                style={{
                  overflow: "hidden",
                }}
              >
                <MovingText
                  text={currentTrack.title as string}
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
