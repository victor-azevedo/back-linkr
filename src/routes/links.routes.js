import { Router } from "express";

import { insertLink } from "../controllers/linkrs.controllers.js";
import { linkSchemaValidation } from "../middlewares/linkSchameValidation.middleware.js";

const router = Router();

router.post("/linkrs", linkSchemaValidation, insertLink);

export default router;
