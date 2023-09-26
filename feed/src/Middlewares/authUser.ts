// create a middleware that authenticates user based on token provided by cookie
// if token is valid, it will set req.user to the user object

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthError from '../Errors/AuthError';

type UserType = {
    email: string;
    id: string;
}

// declare global namespace for Express to extend Request interface
declare global {
    namespace Express {
        interface Request {
            email?: string;
        }
    }
}

export const authUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // get token from cookies
    const token = req.cookies.token;

    // if token exists, verify it
    if (token) {
        try {

            const decoded = jwt.verify(
                token,
                'secret123'
            ) as UserType;

            if (!decoded) return next(new AuthError(401, 'Unauthorized Attempt', null));

            // move to next middleware
            next();

        } catch (err) {
            next(err);
        }
    }
    else return next(new AuthError(401, 'Unauthorized Attempt', null));
};