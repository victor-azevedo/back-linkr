import chalk from "chalk";
import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, { hashLinkrsTb, linkrsTb, usersTb } from "../database/db.js";
import { insertLikesIntoLinkrCard, insertMetadataIntoLinkrCard } from "../helpers/linkrCard.helper.js";
import {
  insertLinkDB,
  selectLastLinks,
  usersLikedLinks,
  insertLikeLinkDB,
  removeLikeLinkDB,
} from "../repository/linkrs.repositories.js";

export async function insertLink(req, res) {
  const userId = res.locals.user.id;
  const { linkUrl, text } = req.body;
  const hashtags = filterHashtags(text);

  //filtro de hashtags
  function filterHashtags(text) {
    const words = text.split(" ");
    const hashtags = words
      .filter((word) => word.startsWith("#"))
      .map((word) => word.substring(1));
    console.log(hashtags);
    return hashtags;
  }

  try {
    const queryResult = await insertLinkDB(linkUrl, text, userId);
    const linkId = queryResult.rows[0].id;

    //função abaixo foi criada para inserir hashtags no banco de dados
    async function insertHashtag(hashtag) {
      let hashtagID = 0;
      const hashtagExists = await connection.query(
        `SELECT * FROM hashtags WHERE "hashtag" = $1; `,
        [hashtag]
      );
      if (hashtagExists.rowCount === 0) {
        const hashtagID1 = await connection.query(
          `INSERT INTO hashtags ("hashtag", "counter") VALUES ($1, $2) RETURNING id;`,
          [hashtag, 1]
        );
        hashtagID = hashtagID1.rows[0].id;
      } else {
        const hashtagID2 = await connection.query(
          `UPDATE hashtags SET "counter" = "counter" + 1 WHERE "hashtag" = $1 RETURNING id;`,
          [hashtag]
        );
        hashtagID = hashtagID2.rows[0].id;
      }
      console.log(hashtagID, " ", linkId);
      await connection.query(
        `INSERT INTO hashlinkrs ("hashtagId", "linkId") VALUES ($1, $2);`,
        [hashtagID, linkId]
      );
    }

    //Abaixo não foi alterado, exceto a linha com comentario

    if (queryResult.rowCount === 0) {
      console.log(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "- BAD_REQUEST: inserted none"
      );
      res.status(401).send("inserted none");
      return;
    }
    for (let hashtag of hashtags) {
      //aqui foi alterado
      await insertHashtag(hashtag);
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
  const userId = res.locals.user.id;

  try {
    const queryResult = await selectLastLinks(userId);

    if (queryResult.rowCount === 0) {
      res.status(200).send(null);
      return;
    }
    const links = [...queryResult.rows];

    const linksWithMetadata = await insertMetadataIntoLinkrCard(links);
    const linksWithMetadataAndLikes = await insertLikesIntoLinkrCard(linksWithMetadata);


    res.send(linksWithMetadataAndLikes);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
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

    console.log("a");

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
