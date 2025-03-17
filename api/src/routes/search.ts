//import validateRequest from "../middleware/validateRequest";
//import {  } from "../schema/user";
//import {  } from '../controllers/user';
import { Router} from'express';
import validateRequest from '../middleware/validateRequest';
import { searchSchema } from '../schema/search';
import { search } from '../controllers/user';
import requireUser from '../middleware/requireUser';
import checkUserType from '../middleware/checkUserType';

const searchRouter = Router();

searchRouter.route('/:type/:city')
            .get([requireUser, 
                checkUserType([1]), 
                validateRequest(searchSchema)], 
                search);



export default  searchRouter;