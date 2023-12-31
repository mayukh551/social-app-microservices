import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import asyncWrapper from '../Middlewares/async-wrapper'
import catchHandler from '../../util/catchHanlder';
import AppError from '../Errors/AppError';

import * as redis from 'redis';
import UserError from '../Errors/UserError';

// Redis Client
const redisClient = redis.createClient();
redisClient.connect().then(() => console.log('Connected to Redis'));

// Prisma Client
const prisma = new PrismaClient();

// Models
const Follow = prisma.follow;
const Post = prisma.post;
const User = prisma.user;


//* add these posts to feed table
async function addPostsToFeed(userId: string, posts: any[]) {
    await prisma.feed.createMany({
        data: posts.map((post) => ({
            userId: userId,
            postId: post.id,
        })),
    });
}

/**
 * @function getFeedPosts
 * @description Get the feed posts for the user
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */
export const getFeedPosts = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

    const { id: userId } = req.params;

    /**
     * condition to decide 
     * - to cache the posts retrieved from the DB so that client can directly get them from the cache
     * OR 
     * - send them to the client via res object
    */
    var useRes = true;


    // check if userID is defined
    if (!userId) {
        throw new UserError(400, "User ID is required", null);
    }

    // check if available in cache
    try {

        const cachedPosts = await redisClient.get(`post:${userId}`);

        if (cachedPosts) {
            redisClient.del(`post:${userId}`);

            const nextPosts = JSON.parse(cachedPosts);

            console.log('Cached madafaqa');

            res.status(200).json({ data: nextPosts });

            // add these posts to feed table
            await addPostsToFeed(userId, nextPosts);

            // cache the next newly generated posts
            useRes = false;
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

        console.log('Top 40 following: ', top40Followings);

        const result: any[] = [];

        //* Get the posts from Feed Table that have already been sent to the client
        var sentPosts = await prisma.feed.findMany({
            select: { id: true, postId: true },
            where: {
                userId: userId,
            },
        }) as any[];

        if (sentPosts.length === 0) {
            console.log("No posts in feed table")
            sentPosts = [];
        }

        else {
            sentPosts = sentPosts.map(post => post.postId as string);
            console.log("Posts in feed table: ", sentPosts);
        }

        //* Get 1 or 2 posts for each following id

        // const followingIds = top40Followings.map((following: any) => following.follwoing as string) as string[];

        for (const following of top40Followings) {

            const followingId = following.following as string;
            console.log('Following ID: ', followingId);

            const posts = await Post.findMany({
                where: {
                    userId: followingId, // Filter by following ids
                    NOT: {
                        id: {
                            in: sentPosts, // Exclude posts that have been sent before
                        },
                    },
                },
                take: 1, // limit to 1 post per following id
            });

            result.push(...posts);

        }

        console.log('Result: ', result);


        /**
         * Cache the fresh result in the Redis
         * So that when the client requests for next 40 or 20 posts,
         * we can then send them from the cache directly
         * instead of querying the DB again
         */
        if (!useRes) {
            // cache the result
            await redisClient.set(`post:${userId}`, JSON.stringify(result));
            console.log('Cached again for next request');
            return;
        }

        //* Prepare the res object

        let size = result.length / 2;
        // let size = result.length;

        //* send these posts to the client
        const firstHalfPosts = result.slice(0, size);

        //* send the first 20 and cache the rest
        res.status(200).json({ data: firstHalfPosts });



        //********************** Caching ******************************



        //* cache these in the redis for next request
        const secondHalfPosts = result.slice(size);
        redisClient.set(`post:${userId}`, JSON.stringify(secondHalfPosts));
        redisClient.expire(`post:${userId}`, 60 * 60 * 5); // 5 hrs

        // add these posts to feed table
        addPostsToFeed(userId, firstHalfPosts);

        // If this is the first request, cache the count of posts
        // const reqCount = await redisClient.get(`post:${userId}:count`);

        // //* if this is the first request, send the response
        // if (!reqCount)
        //     await redisClient.set(`post:${userId}:count`, 1);

        // else await redisClient.set(`post:${userId}`, JSON.stringify(result));


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
            await Follow.create({
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