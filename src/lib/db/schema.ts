import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

// Account Table
export const account = sqliteTable("account", {
  id: integer("id").primaryKey({ autoIncrement: true }).default(1),
  username: text("username").default("Guest"),
  installed: integer("installed", { mode: "boolean" }).default(false),
  theme: text("theme").default("system"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Playback Settings Table
export const playbackSettings = sqliteTable("playback_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  volume: real("volume").default(1.0),
  speed: real("speed").default(1.0),
  loop: integer("loop", { mode: "boolean" }).default(false),
  shuffle: integer("shuffle", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Default Folder Table
export const defaultFolder = sqliteTable("default_folder", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  folderId: text("folder_id").notNull(),
  title: text("title").default("Audiobook"),
  uri: text("uri"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Playlist Table
export const playlist = sqliteTable("playlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  coverImage: text("cover_image").unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// PlaylistTrack Association Table (for Many-to-Many relationship)
export const playlistTrack = sqliteTable("playlist_track", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playlistId: integer("playlist_id")
    .notNull()
    .references(() => playlist.id)
    .unique(),
  trackId: integer("track_id")
    .notNull()
    .references(() => track.id)
    .unique(),
  order: integer("order").default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Track Table
export const track = sqliteTable("track", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("uri").notNull().unique(),
  duration: text("duration").notNull(),
  artwork: text("cover_image"),
  album: text("album"),
  artist: text("artist"),

  isPlaying: integer("is_playing", { mode: "boolean" }).default(false),
  lastPlayed: integer("last_played"), // This will store the last played timestamp `Date.now()`

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Timestamp Table
export const timestamp = sqliteTable("timestamp", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: text("timestamp"),
  title: text("title"),
  trackUrl: text("track_url").notNull().unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Wishlist Table
export const wishlist = sqliteTable("wishlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: text("book_id").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverImage: text("cover_image").notNull(),
  favorite: integer("favorite", { mode: "boolean" }).default(false),
  order: integer("order").default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
