import {Strategy as JwtStrategy, ExtractJwt, VerifiedCallback} from 'passport-jwt'
import {JWT_SECRET} from "../config";
import {tokenTypes} from "./tokens";


const jwtOptions = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload: any, done: VerifiedCallback) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type')
        }
    //    const user = await

    } catch (e) {

    }

};


const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)