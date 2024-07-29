DROP TABLE `files`;--> statement-breakpoint
DROP TABLE `permitted_folders`;--> statement-breakpoint
ALTER TABLE `folders` ADD `cover_image` text NOT NULL;--> statement-breakpoint
ALTER TABLE `history` ADD `track_id` integer;--> statement-breakpoint
ALTER TABLE `last_playing` ADD `track_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `last_playing` ADD `uri` text NOT NULL;--> statement-breakpoint
ALTER TABLE `track` ADD `folder_id` integer;--> statement-breakpoint
ALTER TABLE `track` ADD `track_length` text;--> statement-breakpoint
ALTER TABLE `last_playing` DROP COLUMN `file_name`;--> statement-breakpoint
ALTER TABLE `last_playing` DROP COLUMN `directory`;--> statement-breakpoint
ALTER TABLE `last_playing` DROP COLUMN `path`;--> statement-breakpoint
ALTER TABLE `track` DROP COLUMN `files_id`;--> statement-breakpoint
ALTER TABLE `track` DROP COLUMN `history_id`;