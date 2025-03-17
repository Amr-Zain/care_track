import { Router } from'express';
import requireUser from '../middleware/requireUser';
import validateRequest from '../middleware/validateRequest';
import checkUserType from '../middleware/checkUserType';
import { listAppointments, postAppointment, deleteAppointment, updateAppointmentDate } from '../controllers/appointment';
import { AppointmentsSchema, cancelAppointmentsSchema, listAppointmentsSchema, updateAppointmentsSchema } from '../schema/appointment';


const appointmentRouter = Router({mergeParams: true});
//patient the only one who can book, update or cancel 
appointmentRouter.route('/')
            .get([requireUser], validateRequest(listAppointmentsSchema),listAppointments)
            .post([requireUser,checkUserType([1]), validateRequest(AppointmentsSchema)], postAppointment);
            
appointmentRouter.route('/:appointmentId')
            .delete([requireUser, checkUserType([1]),validateRequest(cancelAppointmentsSchema)],deleteAppointment )
            .patch([requireUser, checkUserType([1]),validateRequest(updateAppointmentsSchema)],updateAppointmentDate );


export default appointmentRouter;