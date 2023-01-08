import { Router } from "express";
import { getUserInUserPage, searchUserQuery } from "../controllers/user.controllers.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { validateIdForUserPage, validateUserQuery } from "../middlewares/userSchemaValidation.middleware.js";

const userRouter = Router();


userRouter.post('/user/query', authValidation, validateUserQuery, searchUserQuery);
userRouter.get('/user/:id', authValidation, validateIdForUserPage, getUserInUserPage);



export default userRouter;