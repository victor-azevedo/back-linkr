import chalk from "chalk";
import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, {
  hashLinkrsTb,
  hashtagsTb,
  linkrsTb,
  usersTb,
} from "../database/db.js";
import { insertLikesIntoLinkrCard, insertMetadataIntoLinkrCard } from "../helpers/linkrCard.helper.js";

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
    const {userPageId} = res.locals;
    console.log(userPageId)
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
      [userPageId]
    );
    const linkrsWithMetadata = await insertMetadataIntoLinkrCard(linkrs);
    const linkrsWithMetadataAndLikes = await insertLikesIntoLinkrCard(linkrsWithMetadata);

    res.status(200).send(linkrsWithMetadataAndLikes);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400).send(error);
  }
}
