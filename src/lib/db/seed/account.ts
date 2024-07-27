import { db } from "@/lib/db";
import { account } from "../schema";

export const seedDefaultAccount = async () => {
  try {
    const response = await db.insert(account).values({
      username: "Guest",
      theme: "dark",
    });

    if (response) {
      console.log("Default Account Created!!!");
    } else {
      console.warn("Error creating default account");
    }
  } catch (error) {
    console.error(error);
  }
};
