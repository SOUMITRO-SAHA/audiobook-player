import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, InputBox, SelectDropdown } from "@/components/ui";
import { db } from "@/lib/db";
import { fetchAccount } from "@/lib/db/query";
import { account } from "@/lib/db/schema";
import { seedDefaultAccount } from "@/lib/db/seed";
import { Account } from "@/types/database";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Appearance, ToastAndroid, useColorScheme } from "react-native";

const initialFormData = {
  username: "",
  theme: "system",
};

const AccountScreen = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [accountData, setAccountData] = useState<Account | null>(null);
  const [theme, setTheme] = useState("dark");

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
        }
      } else {
        // Insert
        const response = await db.insert(account).values({
          username: formData.username,
          theme: theme,
        });
        if (response) {
          ToastAndroid.show("Account Created!!!", ToastAndroid.LONG);
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

    getAccountInfo();
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
        username: accountData?.username,
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

      <ThemedView style={{ flex: 1 }}>
        <Button onPress={handleAccountUpdate} />
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default AccountScreen;
