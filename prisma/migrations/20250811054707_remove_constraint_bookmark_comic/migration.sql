/*
  Warnings:

  - You are about to alter the column `published_at` on the `chapters` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `read_at` on the `historys` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `subscribed_at` on the `subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_comic_id_fkey`;

-- DropIndex
DROP INDEX `bookmarks_comic_id_fkey` ON `bookmarks`;

-- AlterTable
ALTER TABLE `chapters` MODIFY `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `historys` MODIFY `read_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `subscriptions` MODIFY `subscribed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
