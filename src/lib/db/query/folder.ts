import { db } from "../db";

export const fetchAllFolders = async () => {
  try {
    const response = await db.query.folders.findMany();
    if (response) return response;
    return null;
  } catch (error) {
    console.error(error);
  }
};
