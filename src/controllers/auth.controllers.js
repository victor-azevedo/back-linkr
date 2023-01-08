import bcrypt from "bcrypt";
import chalk from "chalk";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { insertUser, selectUser } from "../repository/auth.repositories.js";

export async function signUp(req, res) {
  const { email, password, username, pictureUrl } = req.body;

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    await insertUser(email, passwordHash, username, pictureUrl);

    return res.sendStatus(201);
  } catch (err) {
    console.log(chalk.redBright(err.message));
    return res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  dotenv.config();
  const { email, password } = req.body;

  try {
    const queryResult = await selectUser(email);
    const user = queryResult.rows[0];

    if (!user)
      return res.status(401).send({ message: "Usuário não cadastrado!" });

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid)
      return res.status(401).send({ message: "Senha incorreta" });

    const generateToken = (id, username, pictureUrl) =>
      jwt.sign({ id, username, pictureUrl }, process.env.SECRET_JWT, {
        expiresIn: 86400,
      });

    const token = generateToken(user.id, user.username, user.pictureUrl);

    return res.send({ token });
  } catch (err) {
    return res.sendStatus(500);
  }
}
