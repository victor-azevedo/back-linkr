import chalk from "chalk";
import dayjs from "dayjs";
import { findUser } from "../repository/auth.repositories.js";

export async function existsUserValidation(req, res, next) {
  const newUser = req.body;

  try {
    const queryResult = await findUser(newUser.email, newUser.username);
    if (queryResult.rowCount !== 0) {
      return res.status(409).send({ message: "Esse email/username já existe" });
    }
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    return res.sendStatus(500);
  }

  next();
}
