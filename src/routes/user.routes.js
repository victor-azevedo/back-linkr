import { Router } from "express";
import {
  followUser,
  getUserInUserPage,
  isFollowing,
  searchUserQuery,
  unfollowUser,
} from "../controllers/user.controllers.js";
import { pageParse } from "../middlewares/pageParse.middleware.js";

import { authValidation } from "../middlewares/authValidation.middleware.js";
import {
  checkIfUserAlreadyFollows,
  validateIdForUserPage,
  validateUserQuery,
} from "../middlewares/userSchemaValidation.middleware.js";

const userRouter = Router();

userRouter.use(authValidation);

userRouter.post("/users/query", validateUserQuery, searchUserQuery);
userRouter.get("/user/:id", validateIdForUserPage, pageParse, getUserInUserPage);
userRouter.get("/follows/:id?", isFollowing);
userRouter.delete("/unfollow/:id", unfollowUser);
userRouter.post("/follow/:id", checkIfUserAlreadyFollows, followUser);

export default userRouter;
