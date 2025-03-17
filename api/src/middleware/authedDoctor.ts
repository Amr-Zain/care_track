import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Datastore from '../db/services/index';
import { RequestWithUserSession } from "../utill/types";



export const checkDoctorAuthForDiagnosis = async (req :RequestWithUserSession, res :Response, next :NextFunction) =>{
    const date = new Date();
    date.setHours(0,0,0,0);
    const datastore = new Datastore()
    if(req.user.userType ===1)return next();
    const isExist = await datastore.appointmentExist(req.user.id,req.params.patientId,date)
    if(!isExist){
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'not autrized'})
    }
    next();
}