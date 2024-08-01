import { Colors } from "@/constants";
import { AntDesign, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { MovingText } from "./moving-text";
import { useRouter } from "expo-router";

export const FloatingPlayer = () => {
  const [isActive, setIsActive] = React.useState(false);

  // Router
  const router = useRouter();

  const handlePressThreeDots = React.useCallback(() => {
    setIsActive(!isActive);
  }, []);

  const handlePress = () => {
    router.navigate("/player");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="absolute p-2 px-5 bottom-14 rounded-xl"
      activeOpacity={0.9}
      style={styles.container}
    >
      {/* <Image source={activeTrack.artwork} style={styles.trackArtWorkImage} /> */}
      <View className="flex flex-row items-center space-x-2 max-w-[80%]">
        <ThemedView className="flex items-center justify-center w-12 h-12 p-1 rounded">
          <SimpleLineIcons
            name="music-tone-alt"
            size={24}
            color={Colors.dark.foreground}
          />
        </ThemedView>
        <View className="w-[78%] overflow-hidden">
          <MovingText
            text="Demo Music Long Long Title Title Title Title"
            animationThreshold={25}
            style={{
              overflow: "hidden",
            }}
          />
        </View>
      </View>

      {/* Buttons */}
      <View className="flex flex-row items-center justify-end space-x-4">
        <View>
          <FontAwesome
            name={isActive ? "pause" : "play"}
            size={28}
            color={Colors.dark.foreground}
          />
        </View>
        <View>
          <AntDesign
            name="stepforward"
            size={20}
            color={Colors.dark.foreground}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    left: 8,
    right: 8,
    backgroundColor: Colors.dark.muted,
  },
  trackArtWorkImage: {},
});
