-- CreateTable
CREATE TABLE `SetHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutPlanExerciseSetId` INTEGER NOT NULL,
    `reps` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SetHistory` ADD CONSTRAINT `SetHistory_workoutPlanExerciseSetId_fkey` FOREIGN KEY (`workoutPlanExerciseSetId`) REFERENCES `WorkoutPlanExerciseSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
