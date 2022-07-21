import {catchAsync} from "../utils/catchAsync";
import User from "../models/user";
import {collections} from "../server";
import {generateAuthToken} from "../services/tokenService";
import {tokens, users} from "../config";
import {Request, Response} from 'express'
import ApiError from "../utils/ApiError";
import httpStatus = require("http-status");
import bcrypt from 'bcryptjs'
import {tokenTypes} from "../config/tokens";


const isEmailTaken = async (email: string) => {
    const user = await collections[users].findOne({email});
    return !!user
};

const isPasswordMatch = async (email: string, password: string) => {
    const user = await collections[users].findOne({email: email}).then(r => r);
    return bcrypt.compare(password, user.password)
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
    const user = await collections[users].findOne({email}).then(r => {
        return r
    });

    if (user === null || (await isPasswordMatch(email, password)))
        throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");

    return {
        email: user.email,
        role: user.role,
        name: user.name
    }
};

export const register = catchAsync(async (req: Request, res: Response) => {
    const user = req.body as unknown as User;

    if (await isEmailTaken(user.email))
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is alredy taken');

    const newUser = await collections[users].insertOne(user) as unknown as User;
    const token = await generateAuthToken(newUser);

    return res.send({user, token})
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const {email, password} = req.body;

    let user = await loginWithEmailAndPassword(email, password) as unknown as User;

    let tokens = await generateAuthToken(user);

    return res.send({user, tokens})
});

export const logout = catchAsync(async (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    const refreshTokenDoc = await collections[tokens]
        .findOne({
            token: refreshToken,
            type: tokenTypes.REFRESH,
            blacklisted: false
        });

    if (!refreshTokenDoc) throw new ApiError(httpStatus.NOT_FOUND, "Not found");

    await refreshTokenDoc
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).send())
});