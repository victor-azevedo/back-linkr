import connection, { commentsTb } from "../database/db.js";

export function insertCommentDB(commenterId, commentText, linkId) {
  return connection.query(
    `INSERT INTO ${commentsTb} ("commenterId", "linkId", "commentText") VALUES
  ($1, $2, $3) RETURNING id;`,
    [commenterId, linkId, commentText]
  );
}

export function getCommentsDb(linkId) {
  return connection.query(
    `SELECT c."commentText", u."username" AS "commenterName", u."id" AS "commenterId", u."pictureUrl" AS "commenterPicture"
      FROM comments c
        JOIN users u ON c."commenterId" = u.id
        WHERE c."linkId" = $1`,
    [linkId]
  );
}
