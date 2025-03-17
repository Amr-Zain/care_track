import { Request, Response } from "express";
import Datastore from '../db/services/index';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { RequestWithUserSession } from "../utill/types";


const datastore = new Datastore();
//u have to add profile img url to the schema and hanle its req

export const createUser = async(req :Request, res :Response)=>{
    const user = req.body;
    user.createdAt = Date.now();
    user.id = crypto.randomUUID(); 
    console.log(user)
    const doesEmailexist = await datastore.getUserByEmail(user.email);
    if(doesEmailexist){
        res.status(StatusCodes.CONFLICT).json({message: 'this email already exist'});
        return;
    }
    const doesPhoneexist = await datastore.getUserByPhone(user.phone);
    if(doesPhoneexist){
        res.status(StatusCodes.CONFLICT).json({message: 'this phone already exist'});
        return;
    }
    //validate the city
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await datastore.createUser(user);
    res.status(StatusCodes.OK).json({ message: 'user created' });
}
export const getAuthedUser =async (req :RequestWithUserSession, res :Response) => {
    const { id } = req.user;
    const user = await datastore.getUserById(id);
    if(!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: ' user not found'});
    const userData = {
        name: user.firstName+" " +user.lastName,
        userType: user.userType,
        id: user.id,
        email: user.email,
        image: user.image,
        city: user.city,
        birthday: user.birthday
    }

    return res.status(StatusCodes.ACCEPTED).json({ user: userData })
}
export const postUserImage = async(req, res :Response)=>{
    console.log('cont')
    if (!req?.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No image file provided.' });
    }
    const { id } = (req as RequestWithUserSession).user; 
    const imageUrl = `${process.env.CDN_BASE_URL}/public/images/${req.file.filename}`; 
    await datastore.updateUserImage(imageUrl, id);
    res.status(StatusCodes.OK).json({ message: 'Image uploaded successfully.', url: imageUrl });
}
export const createNewToken = (req: Request, res: Response)=>{
    res.status(StatusCodes.ACCEPTED).json({ accessToken: req['token'] })
}
export const search = async(req :RequestWithUserSession, res :Response)=>{
    const { gender, availability, sort, bloodType, specialization } = req.query;
    const { type, city } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    if(type === 'doctor'){
        const doctors = await datastore.searchDoctors({ city,gender, availability, sort, offset, specialization,limit })
        return res.status(StatusCodes.OK).json({ ...doctors});
    }else if(type === 'nurse'){
        const nurses = await datastore.searchNurse({ city, gender, sort, offset, limit })
        return res.status(StatusCodes.OK).json({ ...nurses});
    }else {
        const isRequest = type !== 'donator';
        //the one effect the count(pages) is avail isRequest city
        const  bloodBank = await datastore.searchBloodBank({ isRequest,bloodType: String(bloodType).replace(/ /g, '+'), availability, city,offset, limit });
        return  res.status(StatusCodes.OK).json({ ...bloodBank});
        
    }
}