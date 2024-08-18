CREATE TABLE `account` (
	`id` integer PRIMARY KEY AUTOINCREMENT DEFAULT 1 NOT NULL,
	`username` text DEFAULT 'Guest',
	`installed` integer DEFAULT false,
	`theme` text DEFAULT 'system',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `default_folder` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`folder_id` text NOT NULL,
	`title` text DEFAULT 'Audiobook',
	`uri` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `playback_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`volume` real DEFAULT 1,
	`speed` real DEFAULT 1,
	`loop` integer DEFAULT false,
	`shuffle` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `playlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cover_image` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `playlist_track` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`playlist_id` integer NOT NULL,
	`track_id` integer NOT NULL,
	`order` integer DEFAULT 1,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlist`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`track_id`) REFERENCES `track`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `timestamp` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text,
	`title` text,
	`track_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `track` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`folder_id` text NOT NULL,
	`file_name` text NOT NULL,
	`uri` text NOT NULL,
	`duration` text NOT NULL,
	`is_playing` integer DEFAULT false,
	`last_played` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` text NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`cover_image` text NOT NULL,
	`favorite` integer DEFAULT false,
	`order` integer DEFAULT 1,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `timestamp_track_url_unique` ON `timestamp` (`track_url`);--> statement-breakpoint
CREATE UNIQUE INDEX `track_uri_unique` ON `track` (`uri`);--> statement-breakpoint
CREATE UNIQUE INDEX `wishlist_book_id_unique` ON `wishlist` (`book_id`);