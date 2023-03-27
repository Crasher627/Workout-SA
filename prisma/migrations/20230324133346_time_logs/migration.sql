-- CreateTable
CREATE TABLE `WorkoutTimeLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hours` INTEGER NOT NULL,
    `minutes` INTEGER NOT NULL,
    `seconds` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `workoutPlanId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutTimeLogs` ADD CONSTRAINT `WorkoutTimeLogs_workoutPlanId_fkey` FOREIGN KEY (`workoutPlanId`) REFERENCES `WorkoutPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
