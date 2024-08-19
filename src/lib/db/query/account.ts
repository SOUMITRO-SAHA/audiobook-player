import { db } from "@/lib/db";

export const fetchAccount = async () => {
  try {
    const response = await db.query.account.findFirst();
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};
