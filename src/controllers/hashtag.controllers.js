import { getUsersById, rankingHashtags } from "../repository/hashtag.repositories.js";
import urlMetadata from "url-metadata";
import connection, { hashLinkrsTb, hashtagsTb, linkrsTb, usersTb } from "../database/db.js";
import { linkrsFilteredByHashtagName, usersLikedLinks } from "../repository/linkrs.repositories.js";
import { insertLikesIntoLinkrCard, insertMetadataIntoLinkrCard } from "../helpers/linkrCard.helper.js";

async function getPostsByHashtags(req, res) {
    const { hashtag: hashtagName } = req.params;
    const {user} = res.locals;

    try {
        const { rows: posts } = await linkrsFilteredByHashtagName(hashtagName);
        const postsWithMetadata = await insertMetadataIntoLinkrCard(posts);
        const postsWithMetadataAndLikes = await insertLikesIntoLinkrCard(postsWithMetadata, user.username);
        console.log(postsWithMetadataAndLikes);
        
        return res.status(200).send(postsWithMetadataAndLikes);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getRankingHashtags(req, res) {
    try {
        const hashtags = await rankingHashtags();
        return res.status(200).send(hashtags);
    } catch (error) {
        console.log(chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message));
        return res.status(500).send(error);
    }
}

export { getPostsByHashtags, getRankingHashtags };
