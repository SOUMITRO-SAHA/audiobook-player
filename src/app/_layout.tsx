import { AppWideSuspense } from "@/components";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DEFAULT_DATABASE_NAME } from "@/constants";
import { useColorScheme } from "@/hooks/useColorScheme";
import migrations from "@/lib/db/drizzle/migrations";
import { StoreProvider } from "@/store";
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
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";

// Database Connector
const expoDb = openDatabaseSync(DEFAULT_DATABASE_NAME);
const db = drizzle(expoDb);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialLoading, setInitialLoading] = useState(true);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Drizzle
  const { success, error } = useMigrations(db, migrations);

  // Initiate Drizzle Studio
  useDrizzleStudio(expoDb);

  // Side Effects
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Renders
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

  if (!loaded && initialLoading) {
    return null;
  }

  return (
    <StoreProvider>
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
    </StoreProvider>
  );
}
