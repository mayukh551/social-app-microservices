import CustomError from "./CustomError";
import statusCodes from "../../config/statusCodes";

export default class AppError extends CustomError {

    statusCode: number | string;
    message: string;
    stack?: string | undefined;
    err: any;

    serverMessage: string; defaultName: string; description: string | undefined;

    private timeStamp: string;

    constructor(statusCode: number | string, message = '', err: any) {
        super();

        Object.setPrototypeOf(this, AppError.prototype);

        // if statusCode provided, else 503
        this.statusCode = statusCode !== undefined ? statusCode : 503;

        // if err exists, extract error stack
        this.stack = err ? err.stack : null;

        // this message is for debugging purposes
        // if default or original error exists and has a message property, 
        // then original error message will be set, else custom message
        this.serverMessage = err && err.message ? err.message : message;

        // if err.name exists, set err.name else null
        this.defaultName = err && err.name ? err.name : "";

        // setting message and description using status Configuration from Config/statusCodes.js
        this.message = message || statusCodes[`${statusCode}`].message;
        this.description = statusCodes[statusCode].description;

        // additional details for finding errors
        this.timeStamp = new Date().toISOString();
    }

    toString() {
        return `${this.name} => ${this.statusCode}] ${this.message} | ${this.timeStamp}`;
    }

    serializeError(err: any): { message: string; field?: string | undefined; }[] {
        throw new Error("Method not implemented.");
    }


}