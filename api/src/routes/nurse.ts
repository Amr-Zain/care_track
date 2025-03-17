
import { Router} from'express';
import requireUser from '../middleware/requireUser';
import validateRequest from '../middleware/validateRequest';
import { getDoctorNurseSchema, postNurseDataSchema } from '../schema/doctor-nurse';
import userTypeCheck from '../middleware/checkUserType';
import { createNurseData, getNurse, getTotalPatients, updateNurseData } from '../controllers/nurse';
import checkUserType from '../middleware/checkUserType';

const nurseRouter = Router();

nurseRouter.route('/')
            .post([requireUser , userTypeCheck([3]),validateRequest(postNurseDataSchema)], createNurseData)
            .put([requireUser, userTypeCheck([3]), validateRequest(postNurseDataSchema)], updateNurseData);
            
nurseRouter.route('/:id').get(validateRequest(getDoctorNurseSchema),getNurse);
nurseRouter.route('/:id/appointment/total')
.get([requireUser,checkUserType([3])],getTotalPatients)

export default  nurseRouter;
