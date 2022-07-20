import {catchAsync} from "../utils/catchAsync";
import {Response, Request} from 'express'
import {collections} from "../server";
import {users} from "../config";
import User from "../models/user";
import ApiError from "../utils/ApiError";
import httpStatus = require("http-status");


export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const allUsers = await collections[users].find({}).toArray() as unknown as User[];
    if (allUsers)
        res.send(allUsers);
    else
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Couldn't get users from db")
});

export const deleteAllUsers = catchAsync(async (req: Request, res: Response) => {
    const allUsers = await collections[users].deleteMany({});
    res.send("Delted all users")
});