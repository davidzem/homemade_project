import {Strategy as JwtStrategy, ExtractJwt, VerifiedCallback} from 'passport-jwt'
import {JWT_SECRET, MongoDB_Collections} from "../config";
import {tokenType, tokenTypes} from "./tokens";
import {collections} from "../server";

const [images, deploys, users] = MongoDB_Collections;

const jwtOptions = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

type PayloadType = {
    type: tokenType,
    sub: any
}

const jwtVerify = async (payload: PayloadType, done: VerifiedCallback) => {
    try {
        let query = payload.sub;
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type')
        }
        const user = await collections[users].findOne({query});
        if (!user) {
            return done(null, false)
        }
        done(null, user)
    } catch (e) {
        done(e, false)
    }

};


export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);