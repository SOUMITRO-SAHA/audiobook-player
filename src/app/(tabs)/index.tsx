import { StyleSheet, View } from "react-native";

import { ThemedScreen } from "@/components";
import { HistorySection, WishListSection } from "@/components/home";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { fetchAccount } from "@/lib/db/query";
import { track, wishlist } from "@/lib/db/schema";
import { useAppStore } from "@/store";
import { Account } from "@/types/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { desc, eq, InferSelectModel } from "drizzle-orm";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useIsPlaying } from "react-native-track-player";
import { updateTimeStampOfActiveTrack } from "@/lib/services/process-data";
import { useRouter } from "expo-router";

const DEFAULT_FOREGROUND_TIME = 2; // 2 Minutes

export default function HomeScreen() {
  const [account, setAccount] = React.useState<Account | null>(null);
  const [trackHistory, setTrackHistory] = React.useState<
    InferSelectModel<typeof track>[] | null
  >();
  const [wishlistItems, setWishlistItems] = React.useState<
    InferSelectModel<typeof wishlist>[] | null
  >(null);

  // Track Hooks
  const { playing } = useIsPlaying();
  const router = useRouter();

  // Store
  const { isLoading, reLoadApplication } = useAppStore();

  // Fetching Account
  const getAccount = React.useCallback(async () => {
    const res = await fetchAccount();
    if (res) {
      setAccount(res);
    }
  }, []);

  // Side Effects
  React.useEffect(() => {
    const getTrackHistory = async () => {
      // First Fetch Active Track
      const lastPlayedTrack = await db.query.track.findMany({
        where: eq(track.isPlaying, true),
      });

      // Second Fetch Fetch Track order by last Played
      const trackHistory = await db
        .select()
        .from(track)
        .orderBy(desc(track.lastPlayed));

      const combinedHistory = [...lastPlayedTrack, ...trackHistory]?.filter(
        ((set) => (t) => {
          if (set.has(t.id)) {
            return false;
          }
          set.add(t.id);
          return true;
        })(new Set<number>())
      );

      setTrackHistory(combinedHistory);
    };

    const getWishlistItems = async () => {
      const wishlistItems = await db.query.wishlist.findMany();
      setWishlistItems(wishlistItems);
    };

    // Calling Account Update
    const timestamp = setTimeout(() => {
      getAccount();
      getTrackHistory();
      getWishlistItems();
    }, 100);
    return () => clearTimeout(timestamp);
  }, []);

  React.useEffect(() => {
    const timestamp = setTimeout(() => {
      getAccount();
    }, 100);
    return () => clearTimeout(timestamp);
  }, [isLoading]);

  React.useEffect(() => {
    if (playing) {
      const interval = setInterval(async () => {
        await updateTimeStampOfActiveTrack();
      }, DEFAULT_FOREGROUND_TIME * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [playing]);

  return (
    <ThemedScreen>
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText type="title" className="capitalize">{`Welcome, ${
          account?.username?.split(" ")[0]
        }`}</ThemedText>

        <TouchableOpacity
          onPress={() => {
            reLoadApplication();
          }}
        >
          <ThemedView
            className="w-10 h-10 p-2 rounded-lg"
            style={{
              backgroundColor: Colors.dark.muted,
            }}
          >
            <Ionicons
              name="reload-outline"
              size={24}
              color={Colors.dark.foreground}
            />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      {/* History Section */}
      <View>
        <ThemedView className="flex flex-row items-center mb-2 space-x-2 text-xl">
          <MaterialIcons name="history" size={24} color="#e2e8f0" />
          <ThemedText className="text-slate-200">History</ThemedText>
        </ThemedView>
        <HistorySection tracks={trackHistory} />
      </View>

      {/* Wishlist Section */}
      {wishlistItems && (
        <View>
          <View className="flex flex-row items-center justify-between w-full">
            <ThemedView className="flex flex-row items-center mb-2 space-x-2 text-xl">
              <MaterialIcons name="playlist-add" size={24} color="#e2e8f0" />
              <ThemedText className="text-slate-200">Wishlist</ThemedText>
            </ThemedView>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                router.push({
                  pathname: "/(wishlist)/wishlist",
                });
              }}
            >
              <ThemedText
                className="underline"
                style={{
                  color: Colors.dark.mutedForeground,
                }}
              >
                See more..
              </ThemedText>
            </TouchableOpacity>
          </View>

          <WishListSection data={wishlistItems} />
        </View>
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({});
