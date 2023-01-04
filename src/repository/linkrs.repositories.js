import connection from "../database/db.js";

export function insertLinkDB(linkUrl, text, userId) {
  console.log(linkUrl, text, userId);
  return connection.query(
    `INSERT INTO linkrs ("linkUrl", "text", "userId") VALUES
  ($1, $2, $3);`,
    [linkUrl, text, userId]
  );
}
