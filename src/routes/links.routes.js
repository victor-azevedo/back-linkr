import { Router } from "express";

import {
  insertLink,
  getLinks,
  likeLink,
  dislikeLink,
} from "../controllers/linkrs.controllers.js";
import { linkSchemaValidation } from "../middlewares/linkSchameValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const router = Router();

router.get("/linkrs", getLinks);
router.post("/linkrs", linkSchemaValidation, insertLink);
router.post("/linkrs/like/:id", likeLink);
router.delete("/linkrs/like/:id", dislikeLink);

export default router;
