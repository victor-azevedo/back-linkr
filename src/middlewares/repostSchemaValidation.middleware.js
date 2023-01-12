import { checkReposts } from "../repository/repost.repositories.js";






export async function preventDoubleRepost(req, res){
    try {
        const { user } = res.locals;
        const { postId } = req.body;
        const { rows: reposts } = await checkReposts(postId, user.id);
        
        if (reposts.length !== 0) throw new Error("You already reposted this linkr");

        next()
    }catch (err){
        console.log(err)
        res.status(400)
        res.send(err)
    }
}