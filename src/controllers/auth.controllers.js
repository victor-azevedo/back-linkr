import bcrypt from "bcrypt";
import chalk from "chalk";
import { insertUser } from "../repository/auth.repositories.js";


export async function signUp(req, res){
    const {email, password, username, pictureUrl} = req.body;

    try {
        const passwordHash = bcrypt.hashSync(password, 10);

        await insertUser(email, passwordHash, username, pictureUrl);

        res.sendStatus(201);

    } catch (err) {
        console.log(
          chalk.redBright(err.message)
        );
        res.sendStatus(500);
      }
};