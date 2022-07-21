import {Request, Response} from 'express'
import passport from "passport";
import User from "../models/user";
import ApiError from "../utils/ApiError";
import httpStatus = require("http-status");
import {Rights, Roles} from "../config/roles";
import roles from '../config/roles'


const verifyCallback = (req: Request, resolve: Function, reject: Function, requiredRights: Rights[]) => async (err: any, user: User, info: string) => {
    if (err || info || !user)
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));

    req.user = user;

    if (requiredRights.length) {
        const userRights = roles.roleRights.get(user.role);
        const hasRequiredRights = requiredRights
            .every(
                (requiredRight) => userRights.includes(requiredRight));

        if (!hasRequiredRights)
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'))

    }
    resolve()
};

export const auth = (requiredRole: Rights[]) => async (req: Request, res: Response, next: Function) => {
    return new Promise((resolve, reject) => {
        passport
            .authenticate('jwt',
                {session: false},
                verifyCallback(req, resolve, reject, requiredRole))(req, res, next)
    })
        .then(() => next())
        .catch((err) => next(err))
};