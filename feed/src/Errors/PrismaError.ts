import AppError from "./AppError";

export default class PrismaError extends AppError {

    constructor(statusCode: string | number, message = '', err: any) {
        super(statusCode, message, err);

        Object.setPrototypeOf(this, PrismaError.prototype);
    }

}