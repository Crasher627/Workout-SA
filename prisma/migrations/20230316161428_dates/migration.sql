/*
  Warnings:

  - Added the required column `updatedAt` to the `WorkoutPlanExerciseSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sethistory` ALTER COLUMN `date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `workoutplanexerciseset` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
