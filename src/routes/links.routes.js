import { Router } from "express";
import {
  insertLink,
  getLinks,
  likeLink,
  dislikeLink,
  deleteLink,
  editLink,
} from "../controllers/linkrs.controllers.js";
import {
  checkIfLinkrIsLiked,
  linkEditionAndDeletionIdValidation,
  linkEditionValidator,
  linkSchemaValidation,
} from "../middlewares/linkSchameValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { createRepostController } from "../controllers/repost.controllers.js";

const linksRouter = Router();

linksRouter.get("/linkrs", authValidation, getLinks);
linksRouter.post("/linkrs", authValidation, linkSchemaValidation, insertLink);
linksRouter.post("/linkrs/like/:id", authValidation, checkIfLinkrIsLiked, likeLink);
linksRouter.delete("/linkrs/like/:id", authValidation, dislikeLink);
linksRouter.delete(
  "/linkrs/delete/:id",
  authValidation,
  linkEditionAndDeletionIdValidation,
  deleteLink
);
linksRouter.put(
  "/linkrs/edit/:id",
  authValidation,
  linkEditionValidator,
  linkEditionAndDeletionIdValidation,
  editLink
);
linksRouter.post("/linkrs/repost", authValidation, createRepostController)

export default linksRouter;
