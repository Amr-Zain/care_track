import { Router } from'express';
import validateRequest from '../middleware/validateRequest';
import { createBloodRequestSchema, deleteBloodRequestSchema, 
    getBloodRequestSchema, updateBloodRequestSchema } from '../schema/blood-bank';
import { createBloodRequest, deleteBloodRequest, getBloodRequest, 
    listUserBloodRequest, updateBloodRequest } from '../controllers/blood-bank';


const appointmentRouter = Router();

appointmentRouter.route('/')
            .get(listUserBloodRequest )
            .post([validateRequest(createBloodRequestSchema)],createBloodRequest)

appointmentRouter.route('/:requestId')
            .get([validateRequest(getBloodRequestSchema)], getBloodRequest )
            .put([validateRequest(updateBloodRequestSchema)],updateBloodRequest)
            .delete([validateRequest(deleteBloodRequestSchema)], deleteBloodRequest)
export default  appointmentRouter;