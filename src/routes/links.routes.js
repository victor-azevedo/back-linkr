import { Router } from "express";

import { insertLink, getLinks } from "../controllers/linkrs.controllers.js";
import { linkSchemaValidation } from "../middlewares/linkSchameValidation.middleware.js";

const router = Router();

router.get("/linkrs", getLinks);
router.post("/linkrs", linkSchemaValidation, insertLink);

export default router;
