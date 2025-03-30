-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `donorName` VARCHAR(191) NULL,
    ADD COLUMN `method` VARCHAR(191) NOT NULL DEFAULT 'Other';
