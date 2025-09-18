

import { Request, Response } from 'express';
import prisma from '../lib/PrismaClient';
import { constrainedMemory } from 'process';


export const getUser = (req:Request, res:Response) => {
    res.status(200).json({ "message": "User retrieved successfully" });
}


export const getUsers = async (req:Request, res:Response) => {

    const users = await prisma.user.findMany();
    res.status(200).json({ "message": "Users retrieved successfully", users });
}

export const deleteAllUsers = async (req:Request,res:Response)=>{

    const user = await prisma.user.deleteMany()
    res.status(200).json({ "message": "Users delete successfully", user });
}