import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserSession } from "../utill/types";


const checkUserType = (type: number[]) =>{
    return async(req :RequestWithUserSession, res :Response, next :NextFunction)=>{
        if( !type.includes(+req.user.userType) ) 
            return res.status(StatusCodes.FORBIDDEN).json({message: 'not authrized userType'}) 
        next();
    }
};
export default checkUserType;