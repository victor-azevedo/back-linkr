import { getPostsByHashtag } from "../repository/hashtag.repositories.js";

async function getPostsByHashtags(req, res) {
    const { hashtag } = req.params;
    try {
        const posts = await getPostsByHashtag(hashtag);
        return res.status(200).send(posts);
    }catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export { getPostsByHashtags};