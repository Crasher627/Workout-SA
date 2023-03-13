import prisma from "../../lib/prismadb"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const {method} = req;
    const session = await getSession({req});


    if(session) {
        switch (method) {
            case 'POST':
                {
                    const {targetEmail, workoutId} = req.body;
                    if(targetEmail && workoutId) {
                        const user = await prisma.user.findUnique({
                            where: { email: targetEmail },
                            select: { id: true }
                          })
                          if (!user) {
                            return res.status(401).json({ error: 'User does not exist' });
                          }
                            const originalWorkoutPlan = await prisma.workoutPlan.findUnique({
                              where: { id: workoutId },
                              include: { workoutPlanExercises: { include: { workoutPlanExerciseSets: true } } },
                            });
                            const copiedWorkoutPlan = await prisma.workoutPlan.create({
                              data: {
                                userId: user.id,
                                workoutName: originalWorkoutPlan.workoutName,
                                workoutPlanExercises: {
                                  create: originalWorkoutPlan.workoutPlanExercises.map((exercise) => ({
                                    exerciseId: exercise.exerciseId,
                                    totalSets: exercise.totalSets,
                                    workoutPlanExerciseSets: {
                                      create: exercise.workoutPlanExerciseSets.map((set) => ({
                                        setNumber: set.setNumber,
                                        reps: set.reps,
                                        weight: set.weight,
                                      })),
                                    },
                                  })),
                                },
                              },
                            });
                          
                            return res.status(201).json(copiedWorkoutPlan);
                          
                          
                    }
                    return res.status(401).json({ error: 'Incorrect values' });
                }
                default:
                    res.setHeader('Allow', ['POST']);
                    res.status(405).end(`Method ${method} not allowed`);
            }
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }