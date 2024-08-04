import { AppWideSuspense } from "@/components";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, DEFAULT_DATABASE_NAME } from "@/constants";
import { useColorScheme } from "@/hooks/useColorScheme";
import useLogTrackPlayerState from "@/hooks/useLogTrackPlayerState";
import useSetupTrackPlayer from "@/hooks/useSetupTrackPlayer";
import migrations from "@/lib/db/drizzle/migrations";
import {
  GetPermissionStatus,
  RequestForStoragePermissions,
} from "@/lib/services/media-library";
import { PlaybackService } from "@/lib/services/musicServices";
import { setupApplication } from "@/lib/services/setup";
import { useTrackPlayerStore } from "@/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as React from "react";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import TrackPlayer from "react-native-track-player";

// Database Connector
const expoDb = openDatabaseSync(DEFAULT_DATABASE_NAME);
const db = drizzle(expoDb);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Store
  const { isSetup, isTrackPlayerRegistered, setRegisterTrackPlayer } =
    useTrackPlayerStore();

  // Drizzle
  const { success, error } = useMigrations(db, migrations);

  // Initiate Drizzle Studio
  useDrizzleStudio(expoDb);

  // Initialize the `React-Native-Track-Player`
  const handleTrackPlayerLoaded = React.useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  });

  // Register the Logs for `React-Native-Track-Player`
  useLogTrackPlayerState();

  // Side Effects
  React.useEffect(() => {
    (async () => {
      // First Check for Permission Status
      const { granted } = await GetPermissionStatus();

      if (!granted) {
        // Request for Storage Permissions
        const permission = await RequestForStoragePermissions();

        if (permission.granted) {
          // Then Call the Setup
          await setupApplication();
        }
      }
    })();

    (async () => {
      try {
        if (!isTrackPlayerRegistered) {
          console.log(`I am called only ${Date.now()}`);
          TrackPlayer.registerPlaybackService(() => PlaybackService);

          // Updating the Status
          setRegisterTrackPlayer(true);
        }
      } catch (error) {
        console.log("Error registering Playback service: ", error);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Renders
  if (!isSetup) {
    return (
      <ParallaxScrollView>
        <ThemedView className="flex flex-row items-center justify-center w-full h-full">
          <ActivityIndicator size={50} color={Colors.dark.primary} />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  if (error) {
    return (
      <ParallaxScrollView>
        <ThemedView>
          <ThemedText>Migration error: {error.message}</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }
  if (!success) {
    return (
      <ThemedView>
        <ThemedText>Migration is in progress...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <RootSiblingParent>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <React.Suspense fallback={<AppWideSuspense />}>
            <SQLiteProvider useSuspense databaseName={DEFAULT_DATABASE_NAME}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen
                    name="player"
                    options={{
                      presentation: "card",
                      gestureEnabled: true,
                      gestureDirection: "vertical",
                      animationDuration: 400,
                      headerShown: false,
                    }}
                  />
                </Stack>
              </ThemeProvider>
            </SQLiteProvider>
          </React.Suspense>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
}
