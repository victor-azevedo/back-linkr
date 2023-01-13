import chalk from "chalk";
import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, { hashLinkrsTb, linkrsTb, usersTb } from "../database/db.js";
import { filterHashtags, insertHashtag } from "../helpers/hashtag.helper.js";
import {
  insertLikesIntoLinkrCard,
  insertMetadataIntoLinkrCard,
  insertRepostsNumberIntoLinkrCard,
} from "../helpers/linkrCard.helper.js";
import {
  insertLinkDB,
  selectLastLinks,
  usersLikedLinks,
  insertLikeLinkDB,
  removeLikeLinkDB,
} from "../repository/linkrs.repositories.js";
import { getRepostsByLinkrId } from "../repository/repost.repositories.js";

export async function insertLink(req, res) {
  const userId = res.locals.user.id;
  const { linkUrl, text } = req.body;
  const hashtags = filterHashtags(text);
  try {
    const queryResult = await insertLinkDB(linkUrl, text, userId);
    const linkId = queryResult.rows[0].id;

    if (queryResult.rowCount === 0) {
      console.log(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "- BAD_REQUEST: inserted none"
      );
      res.status(401).send("inserted none");
      return;
    }
    for (let hashtag of hashtags) {
      await insertHashtag(hashtag, linkId);
    }
    res.sendStatus(201);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.sendStatus(500);
  }
}

export async function getLinks(req, res) {
  const { id: userId, username } = res.locals.user;
  const offset = res.locals.offset;
  const limit = res.locals.limit;

  try {
    const queryResult = await selectLastLinks(userId, limit, offset);

    const repostsQuantity = await getRepostsByLinkrId();

    if (queryResult.rowCount === 0) {
      res.send([]);
      return;
    }
    const links = [...queryResult.rows];

    const linksWithMetadata = await insertMetadataIntoLinkrCard(links);

    const linksWithMetadataAndLikes = await insertLikesIntoLinkrCard(
      linksWithMetadata,
      username
    );
    const linkWithMetadataAndLikesAndAmountOfReposts =
      await insertRepostsNumberIntoLinkrCard(linksWithMetadataAndLikes);

    res.send(linkWithMetadataAndLikesAndAmountOfReposts);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message),
      error
    );
    return res.sendStatus(500);
  }
}

export async function likeLink(req, res) {
  const likerId = res.locals.user.id;
  const linkId = req.params.id;

  try {
    const queryResult = await insertLikeLinkDB(likerId, linkId);

    if (queryResult.rowCount === 0) {
      console.log(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "- BAD_REQUEST: error at insert like"
      );
      res.status(401).send("error at insert like");
      return;
    }

    res.sendStatus(201);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.sendStatus(500);
  }
}

export async function dislikeLink(req, res) {
  const dislikerId = res.locals.user.id;
  const linkId = req.params.id;

  try {
    const queryResult = await removeLikeLinkDB(dislikerId, linkId);

    if (queryResult.rowCount === 0) {
      console.log(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "- BAD_REQUEST: error at remove like"
      );
      res.status(401).send("error at remove like");
      return;
    }

    res.sendStatus(201);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.sendStatus(500);
  }
}

export async function deleteLink(req, res) {
  try {
    const { linkrId, user } = res.locals;

    await connection.query(
      `
    DELETE FROM ${linkrsTb} WHERE id = $1;
    `,
      [linkrId]
    );
    await connection.query(
      `
      DELETE FROM ${hashLinkrsTb} WHERE "linkId" = $1;
      `,
      [user.id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.status(400).send(error);
  }
}

export async function editLink(req, res) {
  try {
    const { textToUpdate, linkrId } = res.locals;
    await connection.query(
      `
        UPDATE ${linkrsTb}
        SET text = $1
        WHERE id = $2
        `,
      [textToUpdate, linkrId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400);
    res.send(error);
    return;
  }
}
