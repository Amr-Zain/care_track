import { RequestWithUserSession } from "../utill/types";
import Datastore from '../db/services';
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { randomUUID } from "crypto";
import { BloodRequest } from "../schema";

const datastore = new Datastore();


export const listUserBloodRequest = async (req: RequestWithUserSession, res: Response) => {
    const bloodRequests = await datastore.listUserBloodRequests(req.user.id);
    res.status(StatusCodes.OK).json({ data: bloodRequests });
}
export const createBloodRequest = async (req: RequestWithUserSession, res: Response) => {
    const bloodRequest : BloodRequest = {
        id: randomUUID(),
        bloodType: req.body.bloodType,
        patientId: req.user.id,
        date: req.body.date,
        describtion: req.body?.describtion,
        city: req.body.city,
        isRequest: req.body.isRequest
    }
    await datastore.createBloodRequest(bloodRequest);
    res.status(StatusCodes.OK).json({ message: `Blood ${req.body.isRequest?'request':'donation'} created`})
}

export const deleteBloodRequest = async (req: RequestWithUserSession, res: Response) => {
    const bloodRequest = await datastore.getBloodRequest(req.params.requestId);
    if(!bloodRequest){
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'blood request not found'});
    }
    if(bloodRequest.patientId !== req.user.id){
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'not authrized'});
    }
    await datastore.deleteBloodRequest(req.params.requestId);
    res.status(StatusCodes.OK).json({ message: 'blood request deleted'});
}

export const getBloodRequest = async (req: RequestWithUserSession, res: Response) => {
    const bloodRequest = await datastore.getBloodRequest(req.params.requestId);
    res.status(StatusCodes.OK).json({ data: bloodRequest});
}

export const updateBloodRequest = async (req: RequestWithUserSession, res: Response) => {
    const bloodRequest : BloodRequest = {
        id: req.params.requestId,
        bloodType: req.body.bloodType,
        patientId: req.user.id,
        date: req.body.date,
        describtion: req.body.describtion,
        city: req.body.city,
        isRequest: req.body.isRequest
    }
    const blood = await datastore.getBloodRequest(req.params.requestId);
    if(!blood){
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'blood request not found'});
    }
    if(blood.patientId !== req.user.id){
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'not authrized'});
    }
    await datastore.updateBloodRequest(bloodRequest);
    res.status(StatusCodes.OK).json({ message: 'blood request updated'});
}


