import connection from "../database/db.js";

export async function existsUserValidation(req, res, next) {
  const newUser = req.body;

  try {
    const user = await connection.query(
      `SELECT "id", "username", "email", "pictureUrl"  FROM users WHERE email=$1`,
      [newUser.email]
    );

    if (user.rows[0]) {
      return res.status(409).send({ message: "Esse email já existe" });
    }
    res.locals.user = user;
  } catch (error) {
    return res.sendStatus(500);
  }

  next();
}
