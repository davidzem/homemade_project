import ApiError from "../utils/ApiError";
import httpStatus = require("http-status");
import {NODE_ENV} from "../config";
import {Request, Response} from 'express'

export const errorConverter = (err: any, req: Request, res: Response, next: Function) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack)
    }

    next(error)
};

export const errorHandler = (err: ApiError, req: Request, res: Response, next: Function) => {
    let {statusCode, message} = err;

    if (NODE_ENV === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR])
    }

    const response = {
        code: statusCode,
        message,
        ...(NODE_ENV === 'dev' && {stack: err.stack})
    };

    if (NODE_ENV === 'dev')
        console.error(err)


    return res.status(statusCode).send(response)
};