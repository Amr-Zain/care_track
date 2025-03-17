
import { Router } from'express';
import requireUser from '../middleware/requireUser';
import validateRequest from '../middleware/validateRequest';
import {  getDoctorAppointmentsSchema, getDoctorNurseSchema, 
        postDoctorDataSchema, updateDoctorDataSchema } from '../schema/doctor-nurse';
import checkUserType from '../middleware/checkUserType';
import { createDoctorData, getDoctor, getTotalPatients, updateDoctorData } from '../controllers/doctor';
import { listAppointments } from '../controllers/appointment';

const doctorRouter = Router();


doctorRouter.route('/')
        .post([requireUser, 
                validateRequest(postDoctorDataSchema),
                checkUserType([2])],
                createDoctorData)
        .put([requireUser, 
                validateRequest(updateDoctorDataSchema),
                checkUserType([2])], 
                updateDoctorData)

doctorRouter.route('/:id')
        .get(validateRequest(getDoctorNurseSchema), getDoctor);

doctorRouter.route('/:id/appointment')
        .get([requireUser, 
                checkUserType([2]), 
                validateRequest(getDoctorAppointmentsSchema)], 
                listAppointments)
                
doctorRouter.route('/:id/appointment/total')
.get([requireUser,checkUserType([2])],getTotalPatients)




export default  doctorRouter;