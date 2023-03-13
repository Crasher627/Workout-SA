/*
  Warnings:

  - You are about to drop the column `totalReps` on the `workoutplanexercise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `workoutplanexercise` DROP FOREIGN KEY `WorkoutPlanExercise_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutplanexercise` DROP FOREIGN KEY `WorkoutPlanExercise_workoutPlanId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutplanexerciseset` DROP FOREIGN KEY `WorkoutPlanExerciseSet_workoutPlanExerciseId_fkey`;

-- AlterTable
ALTER TABLE `workoutplanexercise` DROP COLUMN `totalReps`;

-- AddForeignKey
ALTER TABLE `WorkoutPlanExercise` ADD CONSTRAINT `WorkoutPlanExercise_workoutPlanId_fkey` FOREIGN KEY (`workoutPlanId`) REFERENCES `WorkoutPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutPlanExercise` ADD CONSTRAINT `WorkoutPlanExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutPlanExerciseSet` ADD CONSTRAINT `WorkoutPlanExerciseSet_workoutPlanExerciseId_fkey` FOREIGN KEY (`workoutPlanExerciseId`) REFERENCES `WorkoutPlanExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
