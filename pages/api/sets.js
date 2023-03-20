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
            case 'PUT':
                {
                    // console.log(req.body);
                    const updatedSets = [];
                    const data = req.body;
                    if (data) {
                    for (const setId in data) {
                        const set = data[setId];
                        if (set.reps !== undefined || set.weight !== undefined) {
                            const existingSet = await prisma.workoutPlanExerciseSet.findUnique({
                              where: { id: parseInt(setId) },
                            });

                            const logSet = await prisma.setHistory.create({
                                data: {
                                    workoutPlanExerciseSetId: existingSet.id,
                                    reps: existingSet.reps,
                                    weight: existingSet.weight,
                                    date: existingSet.updatedAt
                                }
                            })
                      
                            // Update the set with the new values
                            const updatedSet = await prisma.workoutPlanExerciseSet.update({
                              where: { id: parseInt(setId) },
                              data: {
                                reps: set.reps !== undefined ? parseInt(set.reps) : existingSet.reps,
                                weight: set.weight !== undefined ? parseInt(set.weight) : existingSet.weight,
                              },
                            });
                      
                            updatedSets.push(updatedSet, logSet);
                        }
                    }
                    return res.status(200).json(updatedSets);
                }
                return res.status(401).json({ error: 'Data must not be empty' });

                }

            default:
                res.setHeader('Allow', ['POST', 'DELETE', 'PUT']);
                res.status(405).end(`Method ${method} not allowed`);
        }
    }
    return res.status(401).json({ error: 'Unauthorized' });

    
}