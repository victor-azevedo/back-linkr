import connection from "../database/db.js";

export function insertLinkDB(linkUrl, text, userId) {
  console.log(linkUrl, text, userId);
  return connection.query(
    `INSERT INTO linkrs ("linkUrl", "text", "userId") VALUES
  ($1, $2, $3);`,
    [linkUrl, text, userId]
  );
}

export function selectLastLinks() {
  return connection.query(
    `SELECT linkrs.id, "linkUrl", "text", users."pictureUrl" AS "userPicture" FROM linkrs
      JOIN users ON linkrs."userId" = users.id
      ORDER BY linkrs.id DESC LIMIT 20
    `
  );
}
