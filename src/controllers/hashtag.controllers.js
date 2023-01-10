import { getUsersById, rankingHashtags } from "../repository/hashtag.repositories.js";
import urlMetadata from "url-metadata";
import connection, { hashLinkrsTb, hashtagsTb, linkrsTb, usersTb } from "../database/db.js";
import { usersLikedLinks } from "../repository/linkrs.repositories.js";
import { insertMetadataIntoLinkrCard } from "../helpers/linkrCard.helper.js";

async function getPostsByHashtags(req, res) {
    const { hashtag } = req.params;
    try {
        const { rows: posts } = await connection.query(
            `
        SELECT l.*, array_agg(h.hashtag) AS hashtags, u.username, u."pictureUrl"
        FROM ${linkrsTb} l
        LEFT JOIN ${hashLinkrsTb} hl ON l.id = hl."linkId"
        LEFT JOIN ${hashtagsTb} h ON hl."hashtagId" = h.id
        LEFT JOIN ${usersTb} u ON l."userId" = u.id
        GROUP BY l.id, u.username, u."pictureUrl"
        HAVING $1 = ANY(array_agg(h.hashtag))
        `,
            [hashtag]
        );

        const postsWithMetadata = await insertMetadataIntoLinkrCard(posts);
        const postsWithMetadataAndLikes = await usersLikedLinks(postsWithMetadata);
        
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
