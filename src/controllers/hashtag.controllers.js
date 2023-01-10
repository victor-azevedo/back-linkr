import { getUsersById, rankingHashtags } from "../repository/hashtag.repositories.js";
import urlMetadata from "url-metadata";
import connection, { hashLinkrsTb, hashtagsTb, linkrsTb, usersTb } from "../database/db.js";
import { usersLikedLinks } from "../repository/linkrs.repositories.js";

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

        const queryLikesResult = await usersLikedLinks();
        const linksLikes = [...queryLikesResult.rows];

        const linksWithMetadata = await Promise.all(
            posts.map(async (link) => {
                try {
                    const linkMetadata = await urlMetadata(link.linkUrl);
                    const { title, description, image } = linkMetadata;
                    const linkWithMetadata = {
                        ...link,
                        linkMetadata: { title, description, image },
                    };
                    return linkWithMetadata;
                } catch (error) {
                    return {
                        ...link,
                        linkMetadata: {
                            title: "",
                            description: "",
                            image: "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
                        },
                    };
                }
            })
        );

        const linksWithMetadataAndLikes = linksWithMetadata.map((linkWithMetadata) => {
            const linkLikesFound = linksLikes.find(
                ({ linkId }) => Number(linkId) === Number(linkWithMetadata.id)
            );
            const linkIsLikedByUser = linkWithMetadata.likerId ? true : false;
            delete linkWithMetadata.likerId;
            return linkLikesFound
                ? {
                      ...linkWithMetadata,
                      likes: {
                          linkIsLikedByUser,
                          usersLiked: [...linkLikesFound.likers],
                          count: linkLikesFound.likers.length,
                      },
                  }
                : {
                      ...linkWithMetadata,
                      likes: {
                          linkIsLikedByUser,
                          usersLiked: [],
                          count: 0,
                      },
                  };
        });
        console.log(linksWithMetadataAndLikes);
        return res.status(200).send(linksWithMetadataAndLikes);
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
