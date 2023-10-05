// import { PrismaClient } from '@prisma/client'
// import { NextFunction, Request, Response } from 'express'
// import asyncWrapper from '../Middlewares/async-wrapper'
// import UserError from '../Errors/UserError';
// import catchHanlder from '../../util/catchHanlder';

// const prisma = new PrismaClient();
// const User = prisma.user;
// const Follow = prisma.follow;

// const incrFollowing = async (req: Request, res: Response, next: NextFunction) => {

//     const userId = req.params.userId;
//     const followingId = req.params.followingId;

//     try {
//         // Increase following count of the user
//         const user = await User.findUnique(userId);

//         if (user === null) throw new UserError(400, "User not found", null);

//         user.following!++;

//         // Increase follower count of the person being followed
//         const followingUser = await User.findById(followingId);
//         followingUser.followerCount++;
//         await followingUser.save();

//         res.status(200).json({ message: 'Following count increased successfully' });
//     } catch (error) {
//         next(error);
//     }
// }