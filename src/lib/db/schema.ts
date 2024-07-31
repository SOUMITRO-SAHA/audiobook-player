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
  uri: text("uri").notNull().unique(),
  coverImage: text("cover_image"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const track = sqliteTable("track", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dbFolderId: integer("actual_folder_id"),
  folderId: text("folder_id").notNull(),
  name: text("file_name").notNull(),
  uri: text("uri").notNull(),
  duration: text("duration").notNull(),
  albumId: text("album_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lastPlaying = sqliteTable("last_playing", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackName: text("track_name").notNull(),
  uri: text("uri").notNull(),
  timestamp: text("timestamp").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const history = sqliteTable("history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackId: integer("track_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
