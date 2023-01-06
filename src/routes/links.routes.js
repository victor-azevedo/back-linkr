import { Router } from "express";
import {
  insertLink,
  getLinks,
  likeLink,
  dislikeLink,
  deleteLink,
  editLink,
} from "../controllers/linkrs.controllers.js";
import { linkEditionAndDeletionIdValidation, linkEditionValidator, linkSchemaValidation } from "../middlewares/linkSchameValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const linksRouter = Router();

linksRouter.get("/linkrs", getLinks);
linksRouter.post("/linkrs", linkSchemaValidation, insertLink);
linksRouter.post("/linkrs/like/:id", likeLink);
linksRouter.delete("/linkrs/like/:id", dislikeLink);
linksRouter.delete("/linkrs/delete/:id", authValidation, linkEditionAndDeletionIdValidation, deleteLink);
linksRouter.put("/linkrs/edit/:id", authValidation, linkEditionValidator, linkEditionAndDeletionIdValidation, editLink );

export default linksRouter;
