import { PrismaClient, Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import asyncWrapper from '../Middlewares/async-wrapper'
import UserError from '../Errors/UserError';
import AppError from '../Errors/AppError';
import catchHanlder from '../../util/catchHanlder';

const prisma = new PrismaClient();
const User = prisma.user;


/**
 * @function getUser
 * @description Get a user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    try {
        const user = await User
            .findMany({
                where: { id: id },
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    followers: true,
                    following: true
                }
            })

        // if user exists
        if (user) {
            res.status(200).json({
                data: user,
                message: "User found successfully"
            })
        }
        // if not, invalid ID
        else {
            throw new UserError(400, "User not found", null);
        }
    }
    catch (err) {
        catchHanlder(err, UserError, next);
    }

});



/**
 * Middleware for updating a user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const updateUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Get the user's id from the request parameters
    const { id } = req.params;
    // Get the new values for the user's username, firstName, lastName, email, and phoneNo from the request body
    const { username, firstName, lastName, email, phoneNo } = req.body;

    try {

        // Update the user with the given id using Prisma's update method
        const updatedUser = await User.update({
            where: { id: id },
            data: {
                username,
                firstName,
                lastName,
                email,
                phoneNo
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                followers: true,
                following: true
            }
        });

        // If the user was updated successfully
        if (updatedUser) {
            // Return the updated user in the response
            res.status(200).json({
                data: updatedUser,
                message: "User updated successfully"
            });
        } else {
            // If the user was not updated successfully, throw an error
            throw new UserError(400, "User not found", null);
        }
    }
    catch (err) {
        catchHanlder(err, UserError, next);
    }
});



/**
 * Middleware for deleting a user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const deleteUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    // extract user id 
    const { id } = req.params;

    try {
        // Delete the user with the given id
        const user = await User.deleteMany({
            where: { id: id }
        });

        if (!user) throw new UserError(400, "User not found", null);

        // Return a success message in the response
        res.status(200).json({
            message: "User deleted successfully"
        });
    }
    catch (err) {
        catchHanlder(err, UserError, next);
    }
});