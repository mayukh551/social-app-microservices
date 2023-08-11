import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import asyncWrapper from '../Middlewares/async-wrapper'
import { hashPassword } from '../../util/passwordManager';
import AuthError from '../Errors/AuthError';
import { comparePassword } from '../../util/passwordManager';
import catchHanlder from '../../util/catchHanlder';
import { generateToken } from '../../util/authToken';

const prisma = new PrismaClient()
const User = prisma.user;

/**
 * @function signup
 * @description Create a new user
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const signup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const {
        username,
        email,
        firstName,
        lastName,
        password
    } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = await User.findFirst({
        where: { email },
        select: { username: true }
    });

    if (user) throw new AuthError(400, "User already exists", null);

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

        const token = generateToken(newUser.email, newUser.id.toString());

        // set token to cookies
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
        });

        res.status(201).json({
            data: {
                user: newUser,
                token: token
            },
            message: "Profile created successfully"
        })
    }
    catch (err) {
        throw new AuthError(500, "Server Error", err);
    }
});


/**
 * @function login
 * @description Login a user
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const login = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    try {
        const user = await User.findFirst({
            where: { email: email },
            select: {
                id: true,
                email: true,
                password: true,
            }
        });

        if (!user) {
            throw new AuthError(404, "User not found", null);
        }

        const isMatch: boolean = await comparePassword(password, user.password);

        if (!isMatch)
            throw new AuthError(401, "Invalid Credentials", null);


        const token = generateToken(email, user.id.toString());

        // set token to cookies
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
        });

        res.status(200).json({
            message: "Login Successful!"
        })
    }
    catch (err) {
        catchHanlder(err, AuthError, next);
    }
});