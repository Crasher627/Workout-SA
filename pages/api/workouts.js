import prisma from "../../lib/prismadb"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const {method} = req;
    const session = await getSession({req});


    if(session) {
        switch (method) {
            case 'POST':
                {
                    const {userId, workoutName} = req.body;
                    if(userId && workoutName) {
                        const workoutPlan = await prisma.workoutPlan.create({
                            data:{
                                userId,
                                workoutName
                            }
                        })
    
                        return res.status(201).json(workoutPlan);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            case 'DELETE':
                {
                    const userId = req.body.userId;
                    const workoutId = req.body.workoutId;
                    if(workoutId && userId) {
                        const removed = await prisma.workoutPlan.deleteMany({
                            where: {
                                userId: userId,
                                id: workoutId
                            }
                        })

                        return res.status(202).json(removed);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            case 'PUT':
                {
                    const {id, workoutName} = req.body.data;
                    if (id && workoutName) {
                        const updated = await prisma.workoutPlan.update({
                            where: {
                                id: id
                            },
                            data: {
                                workoutName: workoutName
                            }
                        
                        })
                    
                        return res.status(200).json(updated)
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }


            default:
                res.setHeader('Allow', ['POST', 'DELETE', 'PUT']);
                res.status(405).end(`Method ${method} not allowed`);
        }
    }
    return res.status(401).json({ error: 'Unauthorized' });

    
}