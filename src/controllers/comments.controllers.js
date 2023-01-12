import chalk from "chalk";
import dayjs from "dayjs";

import {
  insertCommentDB,
  getCommentsDb,
} from "../repository/comments.repositories.js";

export async function insertComment(req, res) {
  const linkId = req.params.id;
  const { commentText } = req.body;
  const commenterId = res.locals.user.id;

  try {
    const queryResult = await insertCommentDB(commenterId, commentText, linkId);

    if (queryResult.rowCount === 0) {
      console.log(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "- BAD_REQUEST: inserted none"
      );
      res.status(401).send("inserted none");
      return;
    }
    return res.sendStatus(201);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.sendStatus(500);
  }
}

export async function getComments(req, res) {
  const linkId = req.params.id;

  try {
    const queryResult = await getCommentsDb(linkId);

    return res.send(queryResult.rows);
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.sendStatus(500);
  }
}
