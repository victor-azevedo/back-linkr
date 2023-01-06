import chalk from "chalk";
import dayjs from "dayjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export function authValidation(req, res, next) {
  dotenv.config();
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      console.log(
        chalk.magentaBright(
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          "- BAD_REQUEST: authorization field unset"
        )
      );
      res.status(401).send("Campo authorization obrigatório");
      return;
    }

    const parts = authorization.split(" ");
    const [schema, token] = parts;
    if (parts.length !== 2) {
      console.log(
        chalk.magentaBright(
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          "- BAD_REQUEST: authorization field invalid format"
        )
      );
      res.status(401).send("Formato campo authorization inválido");
      return;
    }
    if (schema !== "Bearer") {
      console.log(
        chalk.magentaBright(
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          "- BAD_REQUEST: Bearer invalid"
        )
      );
      res.status(401).send("Bearer inválido");
      return;
    }

    const user = jwt.verify(token, process.env.SECRET_JWT);
    res.locals.user = user;
  } catch (error) {
    console.log(
      chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), error.message)
    );
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ message: error.message });
    }
    return res.sendStatus(500);
  }
  next();
}
