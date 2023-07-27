import AppError from "./AppError";

/**
 * @class AuthError
 * @param {number | string} statusCode
 * @param {string} message
 * @param {any} err
 */
export default class AuthError extends AppError {

    constructor(statusCode: number | string, message = '', err: any) {
        super(statusCode, message, err);

        Object.setPrototypeOf(this, AuthError.prototype);
    }
}