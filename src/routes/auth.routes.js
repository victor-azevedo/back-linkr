import { Router } from "express";

import { signUp } from "../controllers/auth.controllers.js";
import { existsUserValidation } from "../middlewares/existsUserValidation.middleware.js";
import { signUpSchemaValidation } from "../middlewares/signUpSchemaValidation.middleware.js";

const router = Router();

router.post("/signup",signUpSchemaValidation, existsUserValidation, signUp);

export default router;