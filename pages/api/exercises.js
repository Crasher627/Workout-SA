import prisma from "../../lib/prismadb"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const {method} = req;
    const session = await getSession({req});

    //console.log(req.body)

    if(session && session.user.isAdmin == true) {
        switch (method) {
            case 'POST':
                {
                    const {name, description} = req.body;
                    if(name && description) {
                        const exercise = await prisma.exercises.create({
                            data:{
                                name,
                                description
                            }
                        })
    
                        return res.status(201).json(exercise);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            case 'DELETE':
                {
                    const id = req.body.id;
                    if(id) {
                        const removed = await prisma.exercises.delete({
                            where: {
                                id: id
                            }
                        })

                        return res.status(202).json(removed);
                    }
                    return res.status(401).json({ error: 'All values must be filled' });
                }

            case 'PUT':
                {
                    //console.log(req.body.data)
                    const {id, name, description} = req.body.data;
                    if (id && name && description) {
                        const updated = await prisma.exercises.update({
                            where: {
                                id: id
                            },
                            data: {
                                name: name,
                                description: description
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