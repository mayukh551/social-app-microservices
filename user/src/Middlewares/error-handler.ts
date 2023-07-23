import { NextFunction, Request, Response } from "express";

/**
 * Error-handling middleware
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log(err);
    res.status(500).json({
        error: err.message
    })

};

export default errorHandler;