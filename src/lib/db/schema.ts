import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const account = sqliteTable("account", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  installed: integer("installed", { mode: "boolean" }).default(false),
  theme: text("theme").default("system"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const playbackSettings = sqliteTable("playback_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  volume: real("volume").default(1.0),
  speed: real("speed").default(1.0),
  loop: integer("loop", { mode: "boolean" }).default(false),
  shuffle: integer("shuffle", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const folders = sqliteTable("folders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  uri: text("uri").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lastPlaying = sqliteTable("last_playing", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("file_name").notNull(),
  directory: text("directory").notNull(),
  path: text("path").notNull(),
  timestamp: text("timestamp").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  trackId: integer("track_id"),
});

export const track = sqliteTable("track", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  coverImage: text("cover_image").notNull(),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  filesId: integer("files_id"),
  historyId: integer("history_id"),
});

export const history = sqliteTable("history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
