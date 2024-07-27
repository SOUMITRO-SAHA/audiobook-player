import { AppWideSuspense } from "@/components";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DEFAULT_DATABASE_NAME } from "@/constants";
import { useColorScheme } from "@/hooks/useColorScheme";
import migrations from "@/lib/db/drizzle/migrations";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from "expo-font";
import * as SQLite from "expo-sqlite";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as React from "react";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";

// Database Connector
const expoDb = openDatabaseSync(DEFAULT_DATABASE_NAME);
const db = drizzle(expoDb);

const sqlDB = SQLite.openDatabaseSync(DEFAULT_DATABASE_NAME);

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
  useDrizzleStudio(sqlDB); // Initiate Drizzle Studio

  // Side Effects
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (error) {
    return (
      <ThemedText>
        <ThemedText>Migration error: {error.message}</ThemedText>
      </ThemedText>
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
    <RootSiblingParent>
      <React.Suspense fallback={<AppWideSuspense />}>
        <SQLiteProvider useSuspense databaseName={DEFAULT_DATABASE_NAME}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </SQLiteProvider>
      </React.Suspense>
    </RootSiblingParent>
  );
}
