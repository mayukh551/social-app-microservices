type StatusCode = {
    message: string,
    description: string
}

const statusCodes: { [key: number | string]: StatusCode } = {
    400: {
        message: "Bad Request",
        description:
            "The server could not understand the request due to invalid syntax or invalid request parameters.",
    },

    401: {
        message: "Unauthorized Attempt!",
        description:
            "The user is not authorized to access the requested resource. The user may need to authenticate or provide valid credentials.",
    },

    403: {
        message: "Forbidden URL",
        description:
            "The user does not have sufficient permissions to access the requested resource. The server refuses to fulfill the request",
    },

    404: {
        message: "User not found",
        description:
            "The requested user could not be found. This may be due to the user not existing, being deleted, or having incorrect permissions.",
    },

    500: {
        message: "Internal Server Error",
        description:
            "An unexpected error occurred on the server side. This could be due to a programming error, a configuration error, or a problem with the server's resources.",
    },

    503: {
        message: "Service Unavailable",
        description: "The server is temporarily unavailable, typically due to maintenance or overload."
    },
    O422: {
        message: "OTP Unprocessable Entity",
        description:
            "Sorry, cannot process OTP request. Please try again later.",
    },
    O429: {
        message: "OTP Too Many Requests",
        description:
            "Too many OTP requests. Please try again later.",
    },
    O440: {
        message: "OTP Expired",
        description:
            "The OTP has expired. Please generate a new OTP to continue.",
    },
    O441: {
        message: "OTP Invalid",
        description:
            "The OTP provided is invalid. Please provide a valid OTP to continue.",
    },
}

export default statusCodes;
