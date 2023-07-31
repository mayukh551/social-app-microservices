abstract class CustomError extends Error {
    abstract statusCode: number | string;
    abstract message: string;
    abstract err: any;
    abstract description: string | undefined;

    constructor() {
        super();

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeError(err: any[] | any): { message: string; field?: string; }[];
}

export default CustomError;