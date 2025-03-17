import { RequestWithUserSession } from "../utill/types";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { Appointment } from "../schema";
import { randomUUID } from "crypto";
import Datastore from '../db/services';

const datastore = new Datastore();


export const listAppointments =async (req :RequestWithUserSession, res :Response) => {
    const date = req.query?.date?new Date(+req.query.date):new Date();
    date.setHours(0,0,0,0);
    if(req.user.userType === 1 ) {// patient
        const appointments = await datastore.listPatientAppointment(req.user.id);
        return res.status(StatusCodes.OK).json({ data: appointments});
    }
    else if( req.user.userType ===3){ //nurse
        const appointments = await datastore.listNurseAppoitment(req.user.id,date);
        return res.status(StatusCodes.OK).json({data:appointments});
    }
    else{
        const appointments = await datastore.listDoctorAppointment(req.user.id, date);
        return res.status(StatusCodes.OK).json({ data: appointments})
    }

}

export const postAppointment =async (req :RequestWithUserSession, res :Response) => {
    const app : Appointment ={
        clinicId: req.body.clinicId,
        patientId: req.user.id,
        date: req.body.date,
        bookedAt: new Date(),
        id: randomUUID(),
        nurseId: req.body.nurseId
    }
    if( !!req.body.clinicId && !!req.body.nurseId){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Either clinicId or nurseId is required not both'}); 
    }
    if( !req.body.clinicId && !req.body.nurseId){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Either clinicId or nurseId is required'}); 
    }
    
    await datastore.createAppointment(app);
    const appointment = await datastore.getPatientAppointment(app.id);
    res.status(StatusCodes.OK).json({ message: 'appointment booked successfully',data: appointment})
}

export const deleteAppointment =async (req :RequestWithUserSession, res :Response) => {
    const { appointmentId} =  req.params;
    console.log(req.params,appointmentId)//{ appointmentId: '76ce04e5-635c-406e-b43c-c5d956ddf627' }
    const appointment = await datastore.getAppointmentById(appointmentId);
    if(!appointment){
        res.status(StatusCodes.NOT_FOUND).json({ message: 'appointnet not exist'});
    }
    if(appointment.patientId !== req.user.id){
        res.status(StatusCodes.FORBIDDEN).json({ message: 'not authrized'})
    }
    await datastore.deleteAppointment(appointmentId);
    res.status(StatusCodes.OK).json({ message: 'appointment booked successfully'})
}

export const updateAppointmentDate =async (req :RequestWithUserSession, res :Response) => {
    const appointment = await datastore.getAppointmentById(req.params.appointmentId);
    if(!appointment){
        res.status(StatusCodes.NOT_FOUND).json({ message: 'appointnet not exist'})
    }
    if(appointment.patientId !== req.user.id){
        res.status(StatusCodes.FORBIDDEN).json({ message: 'not authrized'})
    }
    await datastore.updateAppointmentDate(req.params.appointmentId, req.body.newDate);
    res.status(StatusCodes.OK).json({ message: 'appointment booked successfully'})
}