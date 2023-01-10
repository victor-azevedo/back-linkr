import { Router } from "express";
import { getPostsByHashtags, getRankingHashtags } from "../controllers/hashtag.controllers.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const router = Router();

router.get('/hashtag/:hashtag',authValidation, getPostsByHashtags);
router.get('/hashtag',authValidation, getRankingHashtags);

export default router;