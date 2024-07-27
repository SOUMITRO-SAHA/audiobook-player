import { DEFAULT_DATABASE_NAME } from "@/constants";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/drizzle",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config;
