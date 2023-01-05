import { Router } from "express";
import { getUserInUserPage, searchUserQuery } from "../controllers/user.controllers.js";
import { validateIdForUserPage, validateUserQuery } from "../middlewares/userSchemaValidation.middleware.js";

const userRouter = Router();


userRouter.post('/user/query', validateUserQuery, searchUserQuery);
userRouter.get('/user/:id', validateIdForUserPage, getUserInUserPage);



export default userRouter;