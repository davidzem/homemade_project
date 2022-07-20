import moment, {Moment} from "moment";
import {JWT_ACCESS_EXPIRATION_MINUTES, JWT_REFRESH_EXPIRATION_DAYS, JWT_SECRET, tokens} from "../config";
import {tokenType, tokenTypes} from "../config/tokens";
import jwt from 'jsonwebtoken'
import User from "../models/user";
import {collections} from "../server";

const generateToken = (userId: string, expires: Moment, type: tokenType, secret = JWT_SECRET) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret)
};

const saveToken = async (token: string, userID: string, expires: Moment,
                         type: tokenType, blacklisted = false
) => {
    return await collections[tokens].insertOne({
        token,
        user: userID,
        expires: expires.toDate(),
        type,
        blacklisted
    })
};

const verifyToken = async (token: string, type: tokenType) => {
    const payload = jwt.verify(token, JWT_SECRET);
    const tokenDoc = await collections[tokens].findOne({
        token, type, user: payload.sub, blacklisted: false
    });
    if (!tokenDoc) throw new Error('Token not found')
    return tokenDoc
};

export const generateAuthToken = async (user: User) => {
    const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    }
};