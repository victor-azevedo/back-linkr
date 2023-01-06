import { Router } from "express";
import {
  insertLink,
  getLinks,
  likeLink,
  dislikeLink,
  deleteLink,
} from "../controllers/linkrs.controllers.js";
import { linkDeletionIdValidation, linkSchemaValidation } from "../middlewares/linkSchameValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const linksRouter = Router();

linksRouter.get("/linkrs", getLinks);
linksRouter.post("/linkrs", linkSchemaValidation, insertLink);
linksRouter.post("/linkrs/like/:id", likeLink);
linksRouter.delete("/linkrs/like/:id", dislikeLink);
linksRouter.delete("/linkrs/delete/:id", authValidation, linkDeletionIdValidation, deleteLink);
linksRouter.put("/linkrs/delete/:id");

export default linksRouter;
