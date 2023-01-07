import { getPostsByHashtag, getUsersById } from "../repository/hashtag.repositories.js";
//import { getLinks } from "../repository/linkrs.repositories.js";

async function getPostsByHashtags(req, res) {
    const { hashtag } = req.params;
    try {
        const posts = await getPostsByHashtag(hashtag);
        
        if (posts.rowCount === 0) {
            res.status(200).send("There are no post yet");
            return;
          }

        const object = [];
        for(let i = 0; i < posts.length; i++) {
            const users = await getUsersById(posts[i].userId);
            let post = {
                userid: users[0].id,
                username: users[0].username,
                userPictureUrl: users[0].pictureUrl,
                link: posts[i].linkUrl,
                text: posts[i].text,
                linkMetadata: posts[i].linkMetadata,
                linkIsliked: posts[i].linkIsliked
            }
            object.push(post);
        }
        return res.status(200).send(object);
    }catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export { getPostsByHashtags };


// id,
// username,
// userPictureUrl,
// link,
// text,
// linkMetadata,
// linkIsliked,