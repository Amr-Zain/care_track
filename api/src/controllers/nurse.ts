import {  NurseData } from "../schema/doctor-nurse";
import { RequestWithUserSession } from "../utill/types";
import Datastore from '../db/services';
import { StatusCodes } from "http-status-codes";
import { Response } from "express";

const datastore = new Datastore();

export const createNurseData =async (req :RequestWithUserSession, res :Response) => {
    const nurseData :NurseData= {
        userId: req.user.id,
        fees: req.body.fees,
        description: req.body.description,
        location: req.body.location
    }
    await datastore.createDoctorNurseData(nurseData);
    res.status(StatusCodes.CREATED).json({ message:'Nurse Data created'})
}
export const getNurse =async ( req :RequestWithUserSession, res :Response) => {
    const  id  = req.params.id;
    const doctor = await datastore.getNurse(id);
    res.status(StatusCodes.OK).json({ data: doctor })
}
export const updateNurseData =async(req :RequestWithUserSession, res :Response) =>{
    const doctorData: NurseData = {
        userId: req.user.id,
        fees: req.body.fees,
        description: req.body.description,
        location: req.body.location
    }
    await datastore.updateDoctorNurseData(doctorData);
    res.status(StatusCodes.ACCEPTED).json({ messsage:'doctor data updated'})
}
export const getTotalPatients =async(req :RequestWithUserSession, res :Response) =>{
    const count = await datastore.getNursePatients(req.user.id);
    res.status(StatusCodes.ACCEPTED).json({ count })
}