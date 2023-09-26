import { NextFunction } from "express";
import AppError from "../src/Errors/AppError";

const catchHandler = (err: any, ErrorClass: any, next: NextFunction, msg = "") => {
    if (err instanceof AppError) next(err);
    throw new ErrorClass(500, "Internal Server Error", err);
}

export default catchHandler;