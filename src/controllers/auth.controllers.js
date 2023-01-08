import bcrypt from "bcrypt";
import chalk from "chalk";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { insertUser, selectUser } from "../repository/auth.repositories.js";


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

export async function signIn(req, res){
  dotenv.config();
  const {email, password} = req.body;

  try {
    const queryRes = await selectUser(email);
    const user = queryRes.rows[0]; 
    
    if(!user) res.status(401).send({message: "Usuário não cadastrado!"});

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if(!passwordIsValid) res.status(401).send({message: "senha incorreta"});

      const generateToken = (id, pictureUrl) =>
        jwt.sign({id, pictureUrl}, process.env.SECRET_JWT,{
          expiresIn: 86400,
        });

        const token = generateToken(user.id, user.pictureUrl);

        res.send({token});
        return;
    
  } catch (err){
    res.sendStatus(500);
  }
};