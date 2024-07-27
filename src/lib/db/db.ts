import { DEFAULT_DATABASE_NAME } from "@/constants";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from "./schema";

const expoDB = openDatabaseSync(DEFAULT_DATABASE_NAME, {
  enableChangeListener: true,
});

export const db = drizzle(expoDB, { schema: schema });
