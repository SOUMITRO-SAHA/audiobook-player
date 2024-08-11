import { ThemedScreen } from "@/components";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InputBox, SelectDropdown } from "@/components/ui";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { fetchAccount, fetchAllFolders } from "@/lib/db/query";
import { account } from "@/lib/db/schema";
import { seedDefaultAccount } from "@/lib/db/seed";
import { useAppStore } from "@/store";
import { Account, Folder } from "@/types/database";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Appearance, ToastAndroid, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const initialFormData = {
  username: "",
  theme: "system",
};

const AccountScreen = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [accountData, setAccountData] = useState<Account | null>(null);
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [theme, setTheme] = useState("dark");

  // Store
  const { reLoadAccount } = useAppStore();

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
            theme: theme,
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
          theme: theme,
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

    const getPermittedFolders = async () => {
      const res = await fetchAllFolders();
      if (res) setFolders(res);
    };

    getAccountInfo();
    getPermittedFolders();
  }, []);

  useEffect(() => {
    if (scheme) setTheme(scheme);
  }, [scheme]);

  useEffect(() => {
    if (formData.theme) {
      Appearance.setColorScheme("dark");
    }
  }, [formData.theme]);

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

      {/* Permitted Folders */}
      {folders && (
        <ThemedView>
          <ThemedText className="px-1 mb-2">Permitted Folders</ThemedText>
          <ThemedView className="flex flex-row items-center space-x-2">
            {folders &&
              folders.map((folder) => (
                <TouchableOpacity activeOpacity={0.85} key={folder.id}>
                  <ThemedText className="items-center justify-center w-full p-2 px-3 text-sm bg-slate-700 rounded-xl">
                    {folder?.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
          </ThemedView>
        </ThemedView>
      )}

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
