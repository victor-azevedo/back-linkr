import chalk from "chalk";
import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, {
  hashLinkrsTb,
  hashtagsTb,
  linkrsTb,
  usersTb,
} from "../database/db.js";
import { usersLikedLinks } from "../repository/linkrs.repositories.js";

export async function searchUserQuery(req, res) {
  try {
    const { searchText } = res.locals;

    const { rows: users } = await connection.query(
      ` 
            SELECT id, username, "pictureUrl"
            FROM ${usersTb}
            WHERE username ILIKE CONCAT($1::text, '%') 
        `,
      [searchText]
    );

    res.status(200).send(users);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.send(error);
  }
}

export async function getUserInUserPage(req, res) {
  try {
    const userId = res.locals.user.id;
    const { rows: linkrs } = await connection.query(
      `
        SELECT l.id, l."linkUrl", l.text, l."userId", json_agg(h."hashtag") as "hashtags", u.username, u."pictureUrl"
        FROM ${linkrsTb} l
        LEFT JOIN ${hashLinkrsTb} hl ON l.id = hl."linkId"
        LEFT JOIN ${hashtagsTb} h ON hl."hashtagId" = h.id
        LEFT JOIN ${usersTb} u ON u.id = l."userId"
        WHERE l."userId" = $1
        GROUP BY l.id, l."linkUrl", l.text, l."userId", u.id
        
        `,
      [userId]
    );

    const links = linkrs;

    const linksWithMetadata = await Promise.all(
      links.map(async (link) => {
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
              image:
                "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
            },
          };
        }
      })
    );

    const queryLikesResult = await usersLikedLinks(userId);
    const linksLikes = [...queryLikesResult.rows];

    const linksWithMetadataAndLikes = linksWithMetadata.map(
      (linkWithMetadata) => {
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
      }
    );

    res.status(200).send(linksWithMetadataAndLikes);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400).send(error);
  }
}
