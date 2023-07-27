import { NextFunction, Request, Response } from "express";
import AppError from "../Errors/AppError";

/**
 * @function errorHandler
 * @param {Object} err The Error Object
 * @param {Object} req The HTTP Request Object
 * @param {Object} res The HTTP Request Object
 * @param {Function} next The next function to move to next middleware if any
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // extracting the status code
    const status = Number.isNaN(parseInt(err.status)) ? 500 : err.status;

    // checking if the error is known or unknown
    const hasKnownError = err instanceof AppError;

    // for unknown errors, set the error to 500
    if (!hasKnownError) {
        err = new AppError(500, "Internal Server Error", err);
    }

    // if the error is known, then it is already handled

    //* ---------------------------------- For Testing & Development Stage ----------------------------------

    // extracting the apiEndpoint
    const apiEndpoint = req.method + ' ' + req.originalUrl;

    // const node_env: string = process.env.NODE_ENV as string;
    const node_env: string = "devlopment";

    // check the environment and send the response accordingly
    if (["test", "development"].includes(node_env)) {

        console.log('');

        console.log(`${err.name || err.defaultName} Occured at ${apiEndpoint}`)

        if (process.env.NODE_ENV === 'test')
            console.log(`Error Default Message: ${err.serverMessage}`);

        if (process.env.NODE_ENV === 'development') {
            console.log(err);
        }

        console.log('');

        res.status(status).json({ error: err, message: err.serverMessage });
    }


    //* ---------------------------------- For Production Stage ----------------------------------

    else {
        // sending the response
        res.status(status).json({ message: err.message });
    }

}

export default errorHandler;