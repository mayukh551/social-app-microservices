import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import asyncWrapper from '../Middlewares/async-wrapper'
import catchHandler from '../../util/catchHanlder';
import AppError from '../Errors/AppError';

import * as redis from 'redis';
import UserError from '../Errors/UserError';

// Redis Client
const redisClient = redis.createClient();
redisClient.connect().then(() => console.log('Connected to Redis in cache-data file'));

// Prisma Client
const prisma = new PrismaClient();

// Models
const Follow = prisma.follow;
const Post = prisma.post;
const User = prisma.user;

/**
 * @function getFeedPosts
 * @description Get the feed posts for the user
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */
export const getFeedPosts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { userId } = req.params;

    // check if userID is defined
    if (typeof userId !== 'string') throw new UserError(400, "User ID is required", null);

    // check if available in cache
    try {

        const cachedPosts = await redisClient.get(`post:${userId}`);

        if (cachedPosts) {
            redisClient.del(`post:${userId}`);
            res.status(200).json({ data: JSON.parse(cachedPosts) });
        }


        //* Get Top 40 following accounts

        // find those rows that use_id follows other accounts
        const top40Followings = await Follow.findMany({
            select: { following: true },
            where: {
                userId: userId,
                following: { not: null },
            },
            take: 40,
        });

        const result: any[] = [];


        //* Get 1 or 2 posts for each following id

        for (const following of top40Followings) {

            const followingId = following.following as string;

            const posts = await Post.findMany({
                where: {
                    userId: followingId,
                },
                take: 1,
            });

            result.push(...posts);
        }

        let size = result.length / 2;
        // let size = result.length;

        //* send these posts to the client
        const firstHalfPosts = result.slice(0, size);


        //* cache these in the redis for next request
        const secondHalfPosts = result.slice(size);
        await redisClient.set(`post:${userId}`, JSON.stringify(secondHalfPosts));
        await redisClient.expire(`post:${userId}`, 60 * 60 * 5); // 5 hrs


        // If this is the first request, cache the count of posts
        const reqCount = await redisClient.get(`post:${userId}:count`);

        //* if this is the first request, send the response
        if (!reqCount) {

            await redisClient.set(`post:${userId}:count`, 1);

            //* send the first 20 and cache the rest
            res.status(200).json({ data: firstHalfPosts })
        }
        // res.status(200).json({ data: firstHalfPosts });

        else { // cache the response

            await redisClient.set(`post:${userId}`, JSON.stringify(result));

        }
    }
    catch (err) {
        catchHandler(err, AppError, next);
    }
});


/**
 * @function createFollow
 * @description Create a follow
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */

export const createFollow = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { userId, following = "", follower = "" } = req.body;

    try {

        //* Test Cases
        if (userId === "") throw new UserError(400, "User ID is required", null);
        if (userId === following || userId === follower) throw new UserError(400, "You cannot follow yourself", null);
        if (!follower && !following) throw new UserError(400, "No information about your follower or following user", null);



        try {

            //* Create a follow
            const follow = await Follow.create({
                data: {
                    userId,
                    following,
                    follower
                }
            });

            //* increment the following and follower count

            await User.update({
                where: { id: userId },
                data: { following: { increment: 1 } },
            });

            await User.update({
                where: { id: following },
                data: { followers: { increment: 1 } },
            });


            res.status(200).json({
                message: "Follow created successfully"
            });
        }

        catch (err) {
            throw new UserError(400, "User not found", null);
        }
    }
    catch (err) {
        catchHandler(err, UserError, next);
    }
});