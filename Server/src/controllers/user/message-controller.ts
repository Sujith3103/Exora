import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";


export const composeNewMessage = async(req: Request, res: Response) => {

    const userId = req.user?.id

    if(!userId) return res.status(401).json({message:'not authenticated'})

    try{

        // const isUser

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:'failed to compoase a new message'
        })
    }

}