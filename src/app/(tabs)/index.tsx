import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchAccount } from "@/lib/db/query";
import {
  resetAccount,
  resetIsLoading,
  selectAccount,
  selectApp,
  setAppLoading,
} from "@/store/slice";
import { Account } from "@/types/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "@/constants";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeScreen() {
  const [account, setAccount] = React.useState<Account | null>(null);

  // Redux Store
  const { updated } = useSelector(selectAccount);
  const { isLoading } = useSelector(selectApp);

  // Dispatch
  const dispatch = useDispatch();

  // Fetching Account
  const getAccount = async () => {
    const res = await fetchAccount();
    if (res) {
      setAccount(res);

      // Dispatch Account
      dispatch(resetAccount());
    }
  };

  // Side Effects
  React.useEffect(() => {
    const timestamp = setTimeout(() => {
      // Calling Account Update
      getAccount();

      // Updating the App loading
      if (isLoading) {
        dispatch(resetIsLoading());
      }
    }, 100);
    return () => clearTimeout(timestamp);
  }, [updated, isLoading]);

  return (
    <ParallaxScrollView className="relative">
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText type="title" className="capitalize">{`Welcome, ${
          account?.username?.split(" ")[0]
        }`}</ThemedText>

        <TouchableOpacity
          onPress={() => {
            dispatch(setAppLoading());
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
