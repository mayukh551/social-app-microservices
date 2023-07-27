import { PrismaClient, Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import asyncWrapper from '../Middlewares/async-wrapper'

const prisma = new PrismaClient()
const Post = prisma.post;

/**
 * @function createPost
 * @description Create a new post
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const createPost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const {
        video_url,
        img_url,
        caption,
        userId,
    } = req.body;


    try {
        const newPost= await Post.create({
            data: {
                video_url,
                img_url,
                caption,
                userId,
            }
        });


        const responseData = {
            ...newPost
        };

        res.status(201).json({
            data: responseData,
            message: "Post created successfully"
        })
    }

    catch (err) {
        console.log(err);
        // throw new Error();
    }
});


/**
 * @function getPostByUserId
 * @description Get all posts for a user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const getgetPostByUserIdPost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { userId } = req.params

    const post = await Post
        .findMany({
            where: { userId: userId },
            select: {
                id: true,
                video_url: true,
                img_url: true,
                caption: true,
                likes:true,
                comments:true,
                shares:true,
                createdAt:true,
                updatedAt:true,

            }
        })
    // console.log(post)
    // if post exists
    if (post) {
        res.status(200).json({
            data: post,
            message: "User found successfully"
        })
    }
    // if not, invalid ID
    else {
        // HANDLE POST NOT FOUND : TO BE DONE
        throw new Error();
    }
});







/**
 * @function getPost
 * @description Get a post
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const getPost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params

    const post = await Post
        .findMany({
            where: { id: id },
            select: {
                id: true,
                video_url: true,
                img_url: true,
                caption: true,
                likes:true,
                comments:true,
                shares:true,
                createdAt:true,
                updatedAt:true,

            }
        })
    
    // if post exists
    if (post) {
        res.status(200).json({
            data: post,
            message: "User found successfully"
        })
    }
    // if not, invalid ID
    else {
        // HANDLE POST NOT FOUND : TO BE DONE
        throw new Error();
    }
});



/**
 * @function updatePost
 * @description Update a post
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const updatePost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Get the post's id from the request parameters
    const { id } = req.params;
    // Get the new values for the post's video_url,img_url,caption,userId from the request body
    const {
            video_url,
            img_url,
            caption,
            userId,
        } = req.body;

    // Update the user with the given id using Prisma's update method
    const updatedPost = await Post.update({
        where: { id: id },
        data: {
            video_url,
            img_url,
            caption,
            userId,
        },
        select: {
            id: true,
            video_url: true,
            img_url: true,
            caption: true,
            likes:true,
            comments:true,
            shares:true,
            createdAt:true,
            updatedAt:true,

        }
    });

    // If the user was updated successfully
    if (updatedPost) {
        // Return the updated user in the response
        res.status(200).json({
            data: updatedPost,
            message: "Post updated successfully"
        });
    } else {
        // If the user was not updated successfully, throw an error
        throw new Error();
    }
});



/**
 * Middleware for deleting a user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const deletePost = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    // extract post id 
    const { id } = req.params;

    try {
        // Delete the post with the given id
        await Post.deleteMany({
            where: { id: id }
        });

        // Return a success message in the response
        res.status(200).json({
            message: "Post deleted successfully"
        });
    }
    catch (err) {
        throw new Error();
    }
});