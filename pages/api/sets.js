import prisma from "../../lib/prismadb"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const {method} = req;
    const session = await getSession({req});

    //console.log(req.body)

    if(session) {
        switch (method) {
            case 'POST':
                {
                    const {workoutPlanExerciseId, setNumber} = req.body;
                    const newSetNum = setNumber + 1;
                    if(workoutPlanExerciseId && setNumber && setNumber > 0) {
                        const workoutPlanExerciseSet = await prisma.workoutPlanExerciseSet.create({
                            data:{
                                workoutPlanExerciseId : workoutPlanExerciseId,
                                setNumber: newSetNum,
                                reps: 0,
                                weight: 0
                            }
                        })
                        const updateWorkoutExercise = await prisma.workoutPlanExercise.update({
                            where: {
                                id: workoutPlanExerciseId
                            },
                            data: {
                                totalSets: newSetNum
                            }
                        })

                        return res.status(201).json(workoutPlanExerciseSet, updateWorkoutExercise);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            case 'DELETE':
                {
                    const {workoutPlanExerciseId, setNumber} = req.body;
                    const newSetNum = setNumber - 1;
                                       
                    if(workoutPlanExerciseId && setNumber && setNumber > 0) {
                        const removed = await prisma.workoutPlanExerciseSet.deleteMany({
                            where: {
                                workoutPlanExerciseId: workoutPlanExerciseId,
                                setNumber: setNumber
                            }
                        })

                        const updateWorkoutExercise = await prisma.workoutPlanExercise.update({
                            where: {
                                id: workoutPlanExerciseId
                            },
                            data: {
                                totalSets: newSetNum
                            }
                        })

                        return res.status(202).json(removed, updateWorkoutExercise);
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