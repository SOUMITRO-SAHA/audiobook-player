CREATE TABLE `permitted_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`uri` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permitted_folders_name_unique` ON `permitted_folders` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `permitted_folders_uri_unique` ON `permitted_folders` (`uri`);