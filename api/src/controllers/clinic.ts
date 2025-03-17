import { RequestWithUserSession } from "../utill/types";
import Datastore from '../db/services/index';
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { Clinic } from "../schema";
import crypto from "crypto";
import { Day } from "../schema/clinic";

const datastore = new Datastore();

export const createClinic =async (req :RequestWithUserSession, res :Response) => {
    const clinic: Clinic = {
        id: crypto.randomUUID(),
        doctorId: req.user.id,
        clinicName: req.body.clinicName,
        location: req.body.location,
        phone: req.body.phone,
        city: req.body.city,
    }
    await datastore.addClinic(clinic);
    res.status(StatusCodes.CREATED).json({ message:'clinic created'})
}
export const getClinic =async ( req :RequestWithUserSession, res :Response) => {
    const clinic = await datastore.getClinic(req.params.id);
    if(!clinic) return res.status(StatusCodes.NOT_FOUND).json({ message: 'clinic not found.'})
    res.status(StatusCodes.OK).json({ message:'Doctor Data created'})
}
export const listClinics =async ( req :RequestWithUserSession, res :Response) => {
    const id = req.user.userType ===2?req.user.id:req?.body?.doctorId;

    if(!id)res.status(StatusCodes.BAD_REQUEST).json({ message: 'doctorId is required'})
    const clinics = await datastore.listDoctorClinics(id);
    res.status(StatusCodes.OK).json({ data: clinics })
}
export const deleteClinic =async ( req :RequestWithUserSession, res :Response) => {
    const [isFailed,message,status] = await checkClinc(req.user.id,req.params.clinciId);
    if(isFailed) res.status(+status).json({ message });
    await datastore.deleteClinic(req.params.id);
    res.status(StatusCodes.ACCEPTED).json({ message:'clinic deleted' })
}
export const updateClinic =async ( req :RequestWithUserSession, res :Response) => {
    const clinic: Clinic = {
        id: req.params.id,
        doctorId: req.user.id,
        clinicName: req.body.clinicName,
        location: req.body.location,
        phone: req.body.phone,
        city: req.body.city,
    }
    const [isFailed,message,status] = await checkClinc(req.user.id,req.params.clinciId);
    if(isFailed) res.status(+status).json({ message });
    await datastore.updateClinic(clinic)
    res.status(StatusCodes.ACCEPTED).json({ message:'clinic Data updated' });
}


export const postClinicSchedule =async (req :RequestWithUserSession, res :Response) => {
    const [isFailed,message, status] = await checkClinc(req.user.id,req.params.clinciId);
    if(isFailed) res.status(+status).json({ message });
    await datastore.postClinicSchedule(req.body.days,req.params.clinicId);
    res.status(StatusCodes.CREATED).json({ message: 'Clinic Schedule added successfully'})

}
export const getClinicSchedule =async (req :RequestWithUserSession, res :Response) => {
    const schedule = datastore.getClinicSchedule(req.params.clinicId);
    res.status(StatusCodes.OK).json({ data: schedule });
}

export const addDay =async (req :RequestWithUserSession, res :Response) => {
    const [isFailed,message, status] = await checkClinc(req.user.id,req.params.clinciId);
    if(isFailed) res.status(+status).json({ message })
    const day ={ from:req.body.from, to: req.body.to, clinicId: req.params.clinicId, day: -req.params.day as Day }
    await datastore.postDayToSchedule(day);
    res.status(StatusCodes.OK).json({ message: 'A day added successfully'})
}
export const updateDay =async (req :RequestWithUserSession, res :Response) => {
    const [isFailed,message] = await checkClinc(req.user.id,req.params.clinciId);
    if(isFailed) res.status(StatusCodes.ACCEPTED).json({ message })
    const day ={ from:req.body.from, to: req.body.to, clinicId: req.params.clinicId, day: -req.params.day as Day }
    datastore.updateScheduleDay(day);
    res.status(StatusCodes.OK).json({ message: 'A day updated successfully' });
}
export const deleteDay =async (req :RequestWithUserSession, res :Response) => {
    const schedule = datastore.getClinicSchedule(req.params.clinicId);
    res.status(StatusCodes.OK).json({ data: schedule });
}

export const getAppointmentsSlots  = async (req :RequestWithUserSession, res :Response) => {
    
    const days = [];
    console.log(req.params)
    const clinicId = req.params.clinicId;
    const startDate = req.params.date? new Date(+req.params.date) : new Date();
    console.log({ clinicId, startDate})
    for(let i =0;i<5;i++){
        const date = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDay()+i);
        const day = await datastore.getClinicAppointmentsSlots( clinicId, date );
        days.push(day);
    }
    res.status(StatusCodes.OK).json({ data: days})
}
const checkClinc = async (doctorId: string, clinicId: string)=>{
    const clinic = await datastore.getClinicById (clinicId);
    if(!clinic){
        return [false,'clinic not exist',StatusCodes.NOT_FOUND]
    }
    if(clinic.doctorId !== doctorId){
        return [false,'not authrized to post clinic schedule', StatusCodes.FORBIDDEN]
    }
    return [true, null]
}
