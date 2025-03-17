import { Request, Response, NextFunction } from "express";
import { verify, createToken } from "../jwt";
import Datastore from '../db/services'
import { Session } from "../schema";
const auth = async (req :Request, res :Response, next :NextFunction) =>{
    const datastore = new Datastore()
    let accessToken = req.headers.authorization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken :any = req.headers['x-refresh'];
    if(accessToken && accessToken.startsWith('Bearer ')){
        accessToken = accessToken.split(' ')[1]; 
    }else{
        return next();
    }
    const { decoded, expired } = verify(accessToken);
    if(decoded){
        req['user'] = decoded;
        return next();
    }
    if(expired && refreshToken){//create new access token
        const { decoded } = verify(refreshToken);
            if(!decoded || !decoded?.id) return next();

            const session :Session = await datastore.getSessionById(decoded.id);
            if(!session || !session.valid) return next();

            const user = await datastore.getUserById(session.userId);
            if(!user) return next();

            const newAccessToken = createToken({ id: user.id, userType: user.userType, sessionId: session.id },
                                            { expiresIn: process.env.JWT_ACCESS_TTL });
            res.setHeader("x-access-token", newAccessToken);
            req['token'] = newAccessToken
            req['user'] = { id: user.id, userType: user.userType, sessionId: session.id };
            next();
    }else{
        next();
    }
}
export default auth;