import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as React from "react";
import { ActivityIndicator, Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import TrackPlayer from "react-native-track-player";

import {
  AppWideSuspense,
  ThemedScreen,
  ThemedText,
  ThemedView,
} from "@/components";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors, DEFAULT_DATABASE_NAME } from "@/constants";
import AppContextProvider from "@/context/AppContext";
import useLoadLastPlayTrack from "@/hooks/useLoadLastPlayTrack";
import migrations from "@/lib/db/drizzle/migrations";

import {
  GetPermissionStatus,
  RequestForStoragePermissions,
} from "@/lib/services/media-library";
import { setupApplication } from "@/lib/services/setup";
import {
  PlaybackService,
  useLogTrackPlayerState,
  useSetupTrackPlayer,
} from "@/lib/services/track-player-service";
import { useTrackPlayerStore } from "@/store";
import { useBackgroundTimeStamp } from "@/hooks/useBackgroundTimeStamp";
import { trackActiveTimeStampInForeground } from "@/lib/services/process-data";

// Database Connector
const expoDb = openDatabaseSync(DEFAULT_DATABASE_NAME);
const db = drizzle(expoDb);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isSetup, isTrackPlayerRegistered, setRegisterTrackPlayer } =
    useTrackPlayerStore();
  const router = useRouter();

  // Initialize the Track Player
  useSetupTrackPlayer({
    onLoad: () => SplashScreen.hideAsync(),
  });

  // Register the Logs for Track Player
  useLogTrackPlayerState();

  // Registering the Background Service for updating the time stamp while the player is running in the foreground
  trackActiveTimeStampInForeground();

  React.useEffect(() => {
    if (!isTrackPlayerRegistered) {
      try {
        TrackPlayer.registerPlaybackService(() => PlaybackService);
        setRegisterTrackPlayer(true);
      } catch (error) {
        console.error("Error registering Playback service: ", error);
      }
    }
  }, [isTrackPlayerRegistered, setRegisterTrackPlayer]);

  React.useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      if (url.includes("trackplayer://notification.click")) {
        router.navigate({
          pathname: "player",
        });
      }
    };

    Linking.addEventListener("url", handleDeepLink);
  }, [router]);

  if (!isSetup) {
    return (
      <ThemedScreen>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </ThemedScreen>
    );
  }

  return (
    <>
      <App />
    </>
  );
}

function App() {
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { success, error } = useMigrations(db, migrations);
  useLoadLastPlayTrack();

  // Registering the Background Service for updating the time stamp while the player is running in the background
  useBackgroundTimeStamp();

  React.useEffect(() => {
    (async () => {
      const { granted } = await GetPermissionStatus();
      if (!granted) {
        const permission = await RequestForStoragePermissions();
        if (permission.granted) {
          await setupApplication();
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
      <AppContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <React.Suspense fallback={<AppWideSuspense />}>
              <SQLiteProvider useSuspense databaseName={DEFAULT_DATABASE_NAME}>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="player"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </SQLiteProvider>
            </React.Suspense>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AppContextProvider>
    </RootSiblingParent>
  );
}
