import { Router } from "express";

import { signIn, signUp } from "../controllers/auth.controllers.js";
import { existsUserValidation } from "../middlewares/existsUserValidation.middleware.js";
import { signInSchemaValidation } from "../middlewares/signInSchemaValidation.middleware.js";
import { signUpSchemaValidation } from "../middlewares/signUpSchemaValidation.middleware.js";

const router = Router();

router.post("/signup", signUpSchemaValidation, existsUserValidation, signUp);
router.post("/signin", signInSchemaValidation, signIn);

export default router;
