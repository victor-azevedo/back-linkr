import { Router } from "express";

import { signUp } from "../controllers/auth.controllers.js";
import { signUpSchemaValidation } from "../middlewares/signUpSchemaValidation.middleware.js";

const router = Router();

router.post("/signup",signUpSchemaValidation, signUp);

export default router;