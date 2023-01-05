import { Router } from "express";
import { getPostsByHashtags } from "../controllers/hashtag.controllers.js";

const router = Router();

router.get('/hashtag/:hashtag', getPostsByHashtags);

export default router;