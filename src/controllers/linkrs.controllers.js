import dayjs from "dayjs";
import urlMetadata from "url-metadata";
import connection, { hashLinkrsTb, linkrsTb, usersTb } from "../database/db.js";
import {
  insertLinkDB,
  selectLastLinks,
  usersLikedLinks,
  insertLikeLinkDB,
  removeLikeLinkDB,
} from "../repository/linkrs.repositories.js";

export async function insertLink(req, res) {
  // const userId = res.locals.user.id;
  const userId = 1;
  const { linkUrl, text } = req.body;
  const hashtags = filterHashtags(text);
  
  //filtro de hashtags
  function filterHashtags(text) {
    const words = text.split(" ");
    const hashtags = words.filter((word) => word.startsWith("#")).map((word) => word.substring(1));
    console.log(hashtags);
    return hashtags;
  }

  try {
    const queryResult = await insertLinkDB(linkUrl, text, userId);

    //função abaixo foi criada para inserir hashtags no banco de dados
    async function insertHashtag(hashtag) {
      const hashtagExists = await connection.query(
        `SELECT * FROM hashtags WHERE "hashtag" = $1;`,
        [hashtag]
      );
      if (hashtagExists.rowCount === 0) {
        await connection.query(
          `INSERT INTO hashtags ("hashtag", "counter") VALUES ($1, $2);`,
          [hashtag, 1]
        );
      } else {
        await connection.query(
          `UPDATE hashtags SET "counter" = "counter" + 1 WHERE "hashtag" = $1;`,
          [hashtag]
        );
      }
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
    for (let hashtag of hashtags) { //aqui foi alterado
      await insertHashtag(hashtag);
    }    
    res.sendStatus(201);
  } catch (error) {
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message);
    return res.sendStatus(500);
  }
}


export async function getLinks(req, res) {
  // const userId = res.locals.user.id;
  const userId = 1;

  try {
    const queryResult = await selectLastLinks(userId);

    if (queryResult.rowCount === 0) {
      res.status(200).send("There are no post yet");
      return;
    }
    const links = [...queryResult.rows];

    const queryLikesResult = await usersLikedLinks(userId);
    const linksLikes = [...queryLikesResult.rows];

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

    res.send(linksWithMetadataAndLikes);
  } catch (error) {
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message);
    return res.sendStatus(500);
  }
}

export async function likeLink(req, res) {
  // const likerId = res.locals.user.id;
  const likerId = 1;
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
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message);
    return res.sendStatus(500);
  }
}

export async function dislikeLink(req, res) {
  // const dislikerId = res.locals.user.id;
  const dislikerId = 1;
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
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message);
    return res.sendStatus(500);
  }
}

export async function deleteLink(req, res) {
    try {
        const { linkrId, user } = res.locals;

        await connection.query(
            `
    DELETE FROM ${linkrsTb} WHERE id = $1;
    DELETE FROM ${hashLinkrsTb} WHERE "linkId" = $1;
    `,
            [linkrId, user.id]
        );

        res.sendStatus(200);
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
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
        res.sendStatus(200)
      } catch (err) {
        res.status(400);
        res.send(err);
        console.log(err);
    }
}
