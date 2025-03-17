import { DoctorData } from "../schema/doctor-nurse";
import { RequestWithUserSession } from "../utill/types";
import Datastore from '../db/services';
import { StatusCodes } from "http-status-codes";
import { Response } from "express";

const datastore = new Datastore();

export const createDoctorData =async (req :RequestWithUserSession, res :Response) => {
    const doctorData :DoctorData= {
        userId: req.user.id,
        specialization: req.body.specialization,
        fees: req.body.fees,
        appointmentTime: req.body.appointmentTime,
        description: req.body.description,
    }
    await datastore.createDoctorNurseData(doctorData);
    res.status(StatusCodes.CREATED).json({ message:'Doctor Data created'})
}
export const getDoctor =async ( req :RequestWithUserSession, res :Response) => {
    const id = req.params.id ;
    console.log(id)
    const doctor = await datastore.getDoctor(id);
    res.status(StatusCodes.OK).json({ data: doctor })
}
export const getTotalPatients = async (req :RequestWithUserSession, res :Response)=>{
    console.log(req.user)
    console.log(req.user.id)
    const count = await datastore.getDoctorPatientCount(req.user.id);
    res.status(StatusCodes.OK).json({ count }) 
}
export const updateDoctorData =async(req :RequestWithUserSession, res :Response) =>{  
    const doctorData: DoctorData = {
        userId: req.user.id,
        fees: req.body.fees,
        description: req.body.description,
        appointmentTime: req.body.appointmentTime,
        specialization: req.body.specialization
    }
    await datastore.updateDoctorNurseData(doctorData);
    res.status(StatusCodes.ACCEPTED).json({ messsage:'doctor data updated'})
}