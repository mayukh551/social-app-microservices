import AppError from "./AppError"

export default class PostError extends AppError {

    constructor(statusCode: number | string, message = '', err: any) {
        super(statusCode, message, err);

        Object.setPrototypeOf(this, PostError.prototype);
    }
}