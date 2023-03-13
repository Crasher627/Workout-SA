/*
  Warnings:

  - Added the required column `workoutName` to the `WorkoutPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `workoutplan` ADD COLUMN `workoutName` VARCHAR(191) NOT NULL;
