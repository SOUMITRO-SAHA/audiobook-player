import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
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

import { AppWideSuspense, ThemedScreen } from "@/components";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, DEFAULT_DATABASE_NAME } from "@/constants";
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

// Database Connector
const expoDb = openDatabaseSync(DEFAULT_DATABASE_NAME);
const db = drizzle(expoDb);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Store
  const { isSetup, isTrackPlayerRegistered, setRegisterTrackPlayer } =
    useTrackPlayerStore();

  // Router
  const router = useRouter();

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
      try {
        if (!isTrackPlayerRegistered) {
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
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      if (url.includes("trackplayer://notification.click")) {
        router.dismissAll(); // This will prevent `rntp` default navigation

        // Navigate to the Player screen
        router.navigate({
          pathname: "player",
        });
      }
    };

    Linking.addEventListener("url", handleDeepLink);
  }, [router]);

  // Renders
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

  // Drizzle
  const { success, error } = useMigrations(db, migrations);

  // Initiate Drizzle Studio
  useDrizzleStudio(expoDb);

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
  }, []);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Renders
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <React.Suspense fallback={<AppWideSuspense />}>
            <SQLiteProvider useSuspense databaseName={DEFAULT_DATABASE_NAME}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
            </SQLiteProvider>
          </React.Suspense>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
}
