import connection, { commentsTb } from "../database/db.js";

export function insertCommentDB(commenterId, commentText, linkId) {
  return connection.query(
    `INSERT INTO ${commentsTb} ("commenterId", "linkId", "commentText") VALUES
  ($1, $2, $3) RETURNING id;`,
    [commenterId, linkId, commentText]
  );
}
