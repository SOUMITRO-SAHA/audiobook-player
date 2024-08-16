import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { ToastAndroid, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ThemedButton, ThemedScreen } from "@/components";
import { speedOptions } from "@/components/player/player-features";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InputBox, SelectDropdown } from "@/components/ui";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { fetchAccount } from "@/lib/db/query";
import { account, playbackSettings } from "@/lib/db/schema";
import { seedDefaultAccount } from "@/lib/db/seed";
import { useAppStore, usePlaylistStore } from "@/store";
import { Account, Folder } from "@/types/database";
import { retryAsyncOperation } from "@/lib/utils";
import { router } from "expo-router";

const initialFormData = {
  username: "",
  theme: "system",
};

const AccountScreen = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [accountData, setAccountData] = useState<Account | null>(null);
  const [folders, setFolders] = useState<Folder[] | null>(null);

  // Store
  const { reLoadAccount } = useAppStore();
  const { playbackSpeed, setPlaybackSpeed } = usePlaylistStore();

  // Theme
  const scheme = useColorScheme();

  // Functions
  const handleAccountUpdate = async () => {
    try {
      if (accountData) {
        // Update
        const response = await db
          .update(account)
          .set({
            username: formData.username,
          })
          .where(eq(account.id, 1)); // Singleton Database

        if (response) {
          ToastAndroid.show("Account Updated!!!", ToastAndroid.SHORT);

          // Reloading
          reLoadAccount();
        }
      } else {
        // Insert
        const response = await db.insert(account).values({
          username: formData.username,
        });
        if (response) {
          ToastAndroid.show("Account Created!!!", ToastAndroid.LONG);

          // Reloading
          reLoadAccount();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlaybackSpeedUpdate = async (value: string) => {
    setPlaybackSpeed(Number(value));

    const dbUpdate = async () => {
      try {
        // Update the Playback Settings in the database
        await db.update(playbackSettings).set({
          speed: Number(value),
        });

        ToastAndroid.show(
          "Playback Speed updated successfully",
          ToastAndroid.SHORT
        );
      } catch (error) {
        console.error(
          "Failed to update playback speed in the database:",
          error
        );
        throw error;
      }
    };

    try {
      await retryAsyncOperation(dbUpdate, 3);
    } catch (error) {
      console.error("Failed to update playback speed after retries:", error);
    }
  };

  // Side Effect
  useEffect(() => {
    const getAccountInfo = async () => {
      const res = await fetchAccount();
      if (res) setAccountData(res);
      else {
        // Set a Default Account
        await seedDefaultAccount();
      }
    };

    const tx1 = setTimeout(getAccountInfo, 100);
    return () => {
      clearTimeout(tx1);
    };
  }, []);

  useEffect(() => {
    if (accountData && accountData.username) {
      setFormData((prev) => ({
        ...prev,
        username: accountData.username ? accountData.username : "Undefine",
      }));
    }
  }, [accountData]);

  return (
    <ThemedScreen>
      <ThemedView className="flex-col w-full">
        <ThemedText type="title">Account</ThemedText>
      </ThemedView>

      {/* User Name */}
      <ThemedView>
        <ThemedText className="px-1 mb-1">User Name</ThemedText>
        <InputBox
          state={formData.username}
          setState={(value) => {
            setFormData((prev) => ({
              ...prev,
              username: value,
            }));
          }}
        />
      </ThemedView>

      {/* Playback Speed */}
      <ThemedView>
        <ThemedText className="px-1 mb-2">Default Playback Speed</ThemedText>
        <ThemedView className="flex flex-row items-center space-x-2">
          <SelectDropdown
            data={speedOptions?.map((s) => ({
              value: String(s),
              label: `${s}x`,
            }))}
            state={{ value: String(playbackSpeed), label: `${playbackSpeed}x` }}
            setState={handlePlaybackSpeedUpdate}
          />
        </ThemedView>
      </ThemedView>

      {/* Wishlist */}
      <ThemedView>
        <ThemedButton
          onPress={() => {
            router.push({
              pathname: "(wishlist)/wishlist",
            });
          }}
          style={{
            backgroundColor: Colors.dark.muted,
            alignItems: "flex-start",
          }}
        >
          <ThemedText className="text-start">Go to Wishlist</ThemedText>
        </ThemedButton>
      </ThemedView>

      <TouchableOpacity activeOpacity={0.8} onPress={handleAccountUpdate}>
        <ThemedView
          className="flex items-center justify-center w-full h-12 mt-5 rounded-xl"
          style={{ backgroundColor: Colors.dark.primary }}
        >
          <ThemedText className="text-lg">Save</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedScreen>
  );
};

export default AccountScreen;
