import { db } from "@/lib/db";
import { account } from "../schema";
import { ToastAndroid } from "react-native";
import { useAppStore } from "@/store";

export const seedDefaultAccount = async () => {
  const { setLoading } = useAppStore.getState();
  try {
    const response = await db.insert(account).values({
      username: "Guest",
      theme: "dark",
    });

    if (response) {
      setLoading();
    } else {
      ToastAndroid.show("Error creating default account", ToastAndroid.LONG);
    }
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }
};
