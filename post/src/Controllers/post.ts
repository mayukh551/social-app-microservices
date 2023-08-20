import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import asyncWrapper from "../Middlewares/async-wrapper";
import PostError from "../Errors/PostError";
import AppError from "../Errors/AppError";
import { uploadImage } from "../../util/cloudStorageHelpers";
import catchHanlder from "../../util/catchHanlder";

const prisma = new PrismaClient();
const Post = prisma.post;

/**
 * @function createPost
 * @description Create a new post
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const createPost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {

    const { caption, userId } = req.body;

    console.log(caption, userId);

    // get image file from request
    const myFile = req.file;

    try {

      // check if image file exists
      if (!myFile) throw new PostError(400, 'No Image/file was uploaded', null);

      // upload image to Google Cloud Storage
      const img_url = await uploadImage(myFile) as string;

      // create new post
      const newPost = await Post.create({
        data: {
          img_url,
          caption,
          userId,
        },
      });

      console.log(newPost);

      const responseData = {
        ...newPost,
      };

      res.status(201).json({
        data: responseData,
        message: "Post created successfully",
      });

    } catch (err) {
      catchHanlder(err, PostError, next);
    }
  }
);

/**
 * @function getPostByUserId
 * @description Get all posts for a user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const getgetPostByUserIdPost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const post = await Post.findMany({
        where: { userId: userId },
        select: {
          id: true,
          video_url: true,
          img_url: true,
          caption: true,
          likes: true,
          comments: true,
          shares: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      // console.log(post)
      // if post exists
      if (post.length > 0) {
        res.status(200).json({
          data: post,
          message: "Post found successfully",
        });
      }
      // if not, invalid ID
      else {
        // HANDLE POST NOT FOUND : TO BE DONE

        throw new PostError(500, "Post not found.", null);
      }
    } catch (err) {
      catchHanlder(err, PostError, next);
    }
  }
);

/**
 * @function getPost
 * @description Get a post
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

export const getPost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const post = await Post.findMany({
        where: { id: id },
        select: {
          id: true,
          video_url: true,
          img_url: true,
          caption: true,
          likes: true,
          comments: true,
          shares: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      //   console.log(post)
      // if post exists
      if (post.length > 0) {
        res.status(200).json({
          data: post,
          message: "Post found successfully",
        });
      }
      // if not, invalid ID
      else {
        // HANDLE POST NOT FOUND : TO BE DONE
        throw new PostError(400, "Post does not exist.", null);
      }
    } catch (err) {
      catchHanlder(err, PostError, next);
    }
  }
);

/**
 * @function updatePost
 * @description Update a post
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const updatePost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the post's id from the request parameters
    const { id } = req.params;
    // Get the new values for the post's video_url,img_url,caption,userId from the request body
    const { video_url, img_url, caption, userId } = req.body;

    try {
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
          likes: true,
          comments: true,
          shares: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // If the user was updated successfully
      if (updatedPost) {
        // Return the updated user in the response
        res.status(200).json({
          data: updatedPost,
          message: "Post updated successfully",
        });
      } else {
        // If the user was not updated successfully, throw an error
        throw new PostError(400, "Post does not exist.", null);
      }
    } catch (err) {
      throw new PostError(500, "Internal Server Error", err);
    }
  }
);

/**
 * Middleware for deleting a user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const deletePost = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // extract post id
    const { id } = req.params;

    try {
      // Delete the post with the given id
      const post = await Post.deleteMany({
        where: { id: id },
      });
      //   console.log(post)
      if (post.count === 0)
        // if(!post)
        throw new PostError(400, "Post not found", null);
      // Return a success message in the response

      res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
      }
      else
        throw new PostError(500, "Internal Server Error.", err);
    }
  }
);
