
import { Router } from'express';
import requireUser from '../middleware/requireUser';
import validateRequest from '../middleware/validateRequest';
import {  createClinicSchema, createScheduleSchema, deleteDayToSchedule, getAppointmentsSlotsSchema, getClinicSchema, getScheduleSchema, updateDayToSchedule } from '../schema/clinic';
import { createClinic, deleteClinic, updateClinic,listClinics, 
    postClinicSchedule, getClinicSchedule,updateDay,addDay,deleteDay,
    getClinic,
    getAppointmentsSlots
} from '../controllers/clinic';
import checkUserType from '../middleware/checkUserType';

const clinicRouter = Router();


clinicRouter.route('/')
            .get([requireUser], listClinics)
            .post([requireUser,validateRequest(createClinicSchema),checkUserType([2])],createClinic);

clinicRouter.route('/:id')
            .get([requireUser,validateRequest(getClinicSchema)],getClinic)
            .put([requireUser,validateRequest(createClinicSchema),checkUserType([2])],updateClinic)
            .delete([requireUser,validateRequest(createClinicSchema),checkUserType([2])],deleteClinic); 

clinicRouter.route('/:clinicId/schedule')
            .post([requireUser,checkUserType([2]),validateRequest(createScheduleSchema)],postClinicSchedule)
            .get(validateRequest(getScheduleSchema),getClinicSchedule);

clinicRouter.route('/:clinicId/schedule/:day')
            .delete([requireUser, checkUserType([2]),validateRequest(deleteDayToSchedule)],deleteDay)
            .put([requireUser, checkUserType([2]),validateRequest(updateDayToSchedule)],updateDay)
            .post([requireUser, checkUserType([2]),validateRequest(updateDayToSchedule)],addDay);

clinicRouter.route('/:clinicId/appointmentsSlots/:date')
            .get([validateRequest(getAppointmentsSlotsSchema)], getAppointmentsSlots);
            
export default  clinicRouter;


