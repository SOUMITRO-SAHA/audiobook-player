CREATE TABLE `timestamp` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text,
	`title` text,
	`track_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
