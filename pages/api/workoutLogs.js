import prisma from "../../lib/prismadb"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const {method} = req;
    const session = await getSession({req});


    if(session) {
        switch (method) {
            case 'POST':
                {
                    const {workoutPlanId, hours, minutes, seconds} = req.body;
                    if(workoutPlanId && hours >= 0 && minutes >= 0 && seconds >=0 && minutes <= 60 && seconds <=60) {
                        const workoutTimeLogs = await prisma.workoutTimeLogs.create({
                            data:{
                                workoutPlanId,
                                hours,
                                minutes,
                                seconds
                            }
                        })
    
                        return res.status(201).json(workoutTimeLogs);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }
                default:
                res.setHeader('Allow', ['POST']);
                res.status(405).end(`Method ${method} not allowed`);
        }
    }
    return res.status(401).json({ error: 'Unauthorized' });

    
}