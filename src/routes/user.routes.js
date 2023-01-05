import { Router } from "express";
import { searchUserQuery } from "../controllers/user.controllers.js";
import { validateUserQuery } from "../middlewares/user.middleware.js";

const userRouter = Router();


userRouter.post('/user/query', validateUserQuery, searchUserQuery);



export default userRouter;