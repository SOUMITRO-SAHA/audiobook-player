import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchAccount } from "@/lib/db/query";
import { Account } from "@/types/database";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [account, setAccount] = useState<Account | null>(null);

  // Side Effects
  useEffect(() => {
    // Fetching Account
    const getAccount = async () => {
      const res = await fetchAccount();
      if (res) setAccount(res);
    };

    // Fetching Folders
    // fetchAllFolders();

    getAccount();
  }, []);

  return (
    <ParallaxScrollView className="relative">
      <ThemedView>
        <ThemedText type="title" className="capitalize">{`Welcome, ${
          account?.username?.split(" ")[0]
        }`}</ThemedText>
      </ThemedView>

      <ThemedView className="flex flex-row items-center space-x-2 text-xl">
        <MaterialIcons name="history" size={24} color="#e2e8f0" />
        <ThemedText className="text-slate-200">History</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
