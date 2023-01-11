import { createRepost } from "../repository/repost.repositories.js";

async function createRepostController(req, res) {
    const { postId } = req.body;
    const userId = res.locals.user.id;

    try {
        const repost = await createRepost({userId, postId,});
        res.status(201).send(repost);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export { createRepostController };
