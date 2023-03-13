import prisma from "../../lib/prismadb"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const {method} = req;
    const session = await getSession({req});

    if(session) {
        switch (method) {
            case 'POST':
                {
                    const {exerciseId, totalSets, workoutPlanId} = req.body;
                    const sets = [];
                    if(exerciseId && totalSets && workoutPlanId && totalSets>0) {
                        const workoutPlanExercise = await prisma.workoutPlanExercise.create({
                            data:{
                                workoutPlanId,
                                exerciseId,
                                totalSets,
                            }
                        })
                        for (let i = 1; i <= totalSets; i++) {
                            sets.push({
                              workoutPlanExerciseId: workoutPlanExercise.id,
                              setNumber: i,
                              reps: 0,
                              weight: 0
                            })
                          }
                          const createdSets = await prisma.workoutPlanExerciseSet.createMany({
                            data: sets
                          })

                        return res.status(201).json(workoutPlanExercise, createdSets);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            case 'DELETE':
                {
                    const workoutPlanExerciseId = req.body.workoutPlanExerciseId;                   
                    if(workoutPlanExerciseId) {
                        const removed = await prisma.workoutPlanExercise.delete({
                            where: {
                                id: workoutPlanExerciseId
                            }
                        })

                        return res.status(202).json(removed);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                res.status(405).end(`Method ${method} not allowed`);
        }
    }
    return res.status(401).json({ error: 'Unauthorized' });

    
}