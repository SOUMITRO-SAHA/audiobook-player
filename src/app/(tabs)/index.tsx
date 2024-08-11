import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { fetchAccount } from "@/lib/db/query";
import { useAppStore } from "@/store";
import { Account } from "@/types/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemedScreen } from "@/components";

export default function HomeScreen() {
  const [account, setAccount] = React.useState<Account | null>(null);

  // Store
  const { isLoading, reLoadApplication } = useAppStore();

  // Side Effects
  React.useEffect(() => {
    // Fetching Account
    const getAccount = async () => {
      const res = await fetchAccount();
      if (res) {
        setAccount(res);
      }
    };

    // Calling Account Update
    const timestamp = setTimeout(getAccount, 100);
    return () => clearTimeout(timestamp);
  }, [isLoading]);

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

      <ThemedView className="flex flex-row items-center space-x-2 text-xl">
        <MaterialIcons name="history" size={24} color="#e2e8f0" />
        <ThemedText className="text-slate-200">History</ThemedText>
      </ThemedView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({});
