import requireUser from '../middleware/requireUser';
import validateRequest from '../middleware/validateRequest';
import { createUserSession, deleteUserSession, getUserValidSession } from '../controllers/session';
import express from 'express';
import { createUserSessionSchema } from '../schema/session';


const sessionRouter = express.Router();


sessionRouter.route('/').get(requireUser,getUserValidSession)//list the valid sesssions
.post([validateRequest(createUserSessionSchema)], createUserSession)//login
.delete(requireUser, deleteUserSession);//logout

export default sessionRouter;