import { Router } from "express";

import { signUp } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/signup", signUp);

export default router;