import chalk from "chalk";
import dayjs from "dayjs";
import { userIdSchema, userQueryStringSchema } from "../models/user.model.js";

export async function validateUserQuery(req, res, next) {
  try {
    const { userQuery: userQueryTextToValidate } = req.body;
    const userQueryTextValid = await userQueryStringSchema.validateAsync(
      userQueryTextToValidate
    );

    res.locals.searchText = userQueryTextValid;
    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400).send(error);
    return;
  }
}

export async function validateIdForUserPage(req, res, next) {
  try {
    const userIdToValidate = req.params.id;
    const userIdValidated = await userIdSchema.validateAsync(userIdToValidate);
    res.locals.userPageId = userIdValidated;
    next();
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    res.status(400).send(error);
    return;
  }
}
