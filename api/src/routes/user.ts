import validateRequest from "../middleware/validateRequest";
import { createUserSchema } from "../schema/user";
import { createUser, postUserImage, getAuthedUser, createNewToken } from '../controllers/user';
import { Router} from'express';
import requireUser from "../middleware/requireUser";
import { uploadMiddleware } from "../middleware/preuploadFilesMiddleware";

const userRouter = Router();

userRouter.route('/').post([validateRequest(createUserSchema)], createUser)
                        .get([requireUser], getAuthedUser);

userRouter.route('/refresh').get(createNewToken);
userRouter.route('/image').post([requireUser,uploadMiddleware],postUserImage);



export default  userRouter; 