import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, InputBox, SelectDropdown } from "@/components/ui";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { fetchAccount, fetchAllFolders } from "@/lib/db/query";
import { account } from "@/lib/db/schema";
import { seedDefaultAccount } from "@/lib/db/seed";
import { updateAccount } from "@/store/slice";
import { Account, Folder } from "@/types/database";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Appearance, ToastAndroid, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";

const initialFormData = {
  username: "",
  theme: "system",
};

const AccountScreen = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [accountData, setAccountData] = useState<Account | null>(null);
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [theme, setTheme] = useState("dark");

  // Redux
  const dispatch = useDispatch();

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

          // Dispatching
          dispatch(updateAccount());
        }
      } else {
        // Insert
        const response = await db.insert(account).values({
          username: formData.username,
          theme: theme,
        });
        if (response) {
          ToastAndroid.show("Account Created!!!", ToastAndroid.LONG);

          // Dispatching
          dispatch(updateAccount());
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
    <ParallaxScrollView>
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

      {/* Theme */}
      <ThemedView>
        <ThemedText className="px-1 mb-1">System Theme</ThemedText>

        <SelectDropdown
          data={[
            { title: "light", icon: "sunny" },
            { title: "dark", icon: "dark-mode" },
          ]}
          placeholder="Select the theme"
          state={theme}
          setState={(value) => {
            const { title } = value as unknown as {
              icon: string;
              title: string;
            };
            setFormData((prev) => ({
              ...prev,
              theme: title,
            }));
          }}
        />
      </ThemedView>

      {/* Permitted Folders */}
      {folders && (
        <ThemedView>
          <ThemedText className="px-1 mb-1">Permitted Folders</ThemedText>
          <ThemedView className="flex flex-row items-center space-x-2">
            {folders &&
              folders.map((folder) => (
                <ThemedText className="items-center justify-center p-2 px-3 bg-slate-400 rounded-xl">
                  {folder?.name}
                </ThemedText>
              ))}
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={{ flex: 1 }}>
        <TouchableOpacity onPress={handleAccountUpdate}>
          <ThemedView
            className="flex items-center justify-center w-full h-12 mt-5 rounded-xl"
            style={{ backgroundColor: Colors.dark.primary }}
          >
            <ThemedText className="text-lg">Save</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default AccountScreen;
