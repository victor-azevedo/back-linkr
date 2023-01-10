import chalk from "chalk";
import dayjs from "dayjs";
import connection, { hashLinkrsTb, likesTb, linkrsTb } from "../database/db.js";
import {
  linkrEditSchema,
  linkrIdSchema,
  linkSchema,
} from "../models/linkrs.model.js";
import { checkUserLinkPossession } from "../repository/linkrs.repositories.js";

export function linkSchemaValidation(req, res, next) {
  const body = req.body;

  const { error } = linkSchema.validate(body, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message);
    console.log(
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
      "- BAD_REQUEST:",
      message
    );
    res.status(422).send({ message });
    return;
  }

  next();
}

export async function linkEditionAndDeletionIdValidation(req, res, next) {
  try {
    const { id: linkrIdToValidate } = req.params;
    const { user } = res.locals;
    const linkrValidatedId = await linkrIdSchema.validateAsync(
      linkrIdToValidate
    );

    const { rows } = await checkUserLinkPossession(linkrValidatedId, user.id);
    if (rows.length === 0) throw new Error("Unauthorized deletion");

    res.locals.linkrId = linkrValidatedId;
    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    if (error.message === "Unauthorized deletion") res.status(401);
    else res.status(400);
    res.send(error);
    return;
  }
}

export async function linkEditionValidator(req, res, next) {
  try {
    const { updatedText: textToValidate } = req.body;
    const validatedText = await linkrEditSchema.validateAsync(textToValidate);
    res.locals.textToUpdate = validatedText;
    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400);
    res.send(error);
    return;
  }
}


export async function checkIfLinkrIsLiked(req, res, next) {
  try {
    const { user } = res.locals;
    const { id: linkrId } = req.params;
    const { rows } = await connection.query(
      `
      SELECT *
      FROM ${likesTb} l
      WHERE l."linkId" = $1 AND l."likerId" = $2;
    `, [linkrId, user.id]
    );

    if (rows.length !== 0) throw new Error("Linkr already liked");

    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400);
    res.send(error.message);
  }
}