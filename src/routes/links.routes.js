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
import { pageParse } from "../middlewares/pageParse.middleware.js";
import { createRepostController } from "../controllers/repost.controllers.js";
import { preventDoubleRepost } from "../middlewares/repostSchemaValidation.middleware.js";

const linksRouter = Router();

linksRouter.use(authValidation);

linksRouter.get("/linkrs", pageParse, getLinks);
linksRouter.post("/linkrs", linkSchemaValidation, insertLink);
linksRouter.post("/linkrs/like/:id", checkIfLinkrIsLiked, likeLink);
linksRouter.delete("/linkrs/like/:id", dislikeLink);
linksRouter.delete(
  "/linkrs/delete/:id",
  linkEditionAndDeletionIdValidation,
  deleteLink
);
linksRouter.put(
  "/linkrs/edit/:id",
  linkEditionValidator,
  linkEditionAndDeletionIdValidation,
  editLink
);
linksRouter.post("/linkrs/repost", preventDoubleRepost, createRepostController);

export default linksRouter;
