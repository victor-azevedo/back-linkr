import { Router } from "express";
import { getPostsByHashtags, getRankingHashtags } from "../controllers/hashtag.controllers.js";

const router = Router();

router.get('/hashtag/:hashtag', getPostsByHashtags);
router.get('/hashtag', getRankingHashtags);

export default router;