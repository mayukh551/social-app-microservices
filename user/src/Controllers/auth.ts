import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import asyncWrapper from '../Middlewares/async-wrapper'
import { hashPassword } from '../../util/passwordManager';
import AuthError from '../Errors/AuthError';

const prisma = new PrismaClient()
const User = prisma.user;

export const signup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const {
        username,
        email,
        firstName,
        lastName,
        password
    } = req.body;

    const hashedPassword = await hashPassword(password);


    try {
        const newUser = await User.create({
            data: {
                username,
                email,
                firstName,
                lastName,
                password: hashedPassword
            }
        });

        // to convert BigInt to String
        const responseData = {
            ...newUser
        };

        res.status(201).json({
            data: responseData,
            message: "Profile created successfully"
        })
    }
    catch (err) {
        throw new AuthError(500, "Server Error", err);
    }
});