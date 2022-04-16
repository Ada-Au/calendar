-- AlterTable
ALTER TABLE `Todo` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterIndex
ALTER TABLE `Todo` RENAME INDEX `taskId` TO `fk_task`;
