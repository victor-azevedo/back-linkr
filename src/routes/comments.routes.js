import { Router } from "express";
import {
  getComments,
  insertComment,
} from "../controllers/comments.controllers.js";

import { commentSchemaValidation } from "../middlewares/commentSchemaValidation.middleware.js";

import { authValidation } from "../middlewares/authValidation.middleware.js";

const commentsRouter = Router();

commentsRouter.use(authValidation);

commentsRouter.post(
  "/comments/linkr/:id",
  commentSchemaValidation,
  insertComment
);
commentsRouter.get("/comments/linkr/:id", getComments);

export default commentsRouter;
