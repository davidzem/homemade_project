import {Response, Request} from 'express'

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
};