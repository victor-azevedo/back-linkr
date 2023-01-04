import bcrypt from "bcrypt";
import chalk from "chalk";
import dayjs from "dayjs";

export async function signUp(req, res){
    const {email, password, username, pictureUrl} = req.body;

    try {
        const poasswordHash = bcrypt.hashSync(password, 10);

        await insertUser(email, poasswordHash, username, pictureUrl);

        res.senmdStatus(201);

    } catch (err) {
        console.log(
          chalk.redBright(dayjs().format("YYYY-MM-DD HH:mm:ss"), err.message)
        );
        res.sendStatus(500);
      }
};